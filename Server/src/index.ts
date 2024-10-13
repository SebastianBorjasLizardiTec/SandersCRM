import express, { Request, Response } from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import path from 'path';
import credentialsRoutes from './routes/credentials';
import { ObjectId } from 'mongodb';
import donorsRoutes from './routes/donors';
import usersRoutes from './routes/users';

dotenv.config();

console.log('Starting server...');

const app = express();
app.use(express.json());
const uri = "mongodb+srv://admin:4dm1n_@crm.t2lqy.mongodb.net/";

app.use(cors({ // Permite que cualquier origen pueda acceder a la API
    exposedHeaders: ['X-Total-Count'], // Expone el encabezado X-Total-Count
})); 

if (!uri) {
    console.error('MONGODB_URI is not defined in the environment variables');
    process.exit(1);
}

const client = new MongoClient(uri);

export const connectToMongo = async () => {
    console.log('connecting to mongo...')
    try {
        await client.connect();
        console.log('Connected successfully to MongoDB');
        return client.db('CRM');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
};

const JWT_SECRET = process.env.JWT_SECRET || 'secret-keyy';
const SALT_ROUNDS = 10;

const startServer = async () => {
    try {
        const db = await connectToMongo();
        
        // Login route
        app.post('/api/login', async (req: Request, res: Response) => {
            console.log('Login attempt:', req.body.email);
            try {
                const { email, password } = req.body;
                const usersCollection = db.collection('users');

                const user = await usersCollection.findOne({ email });

                if (!user) {
                    console.log('Login failed: User not found');
                    return res.status(401).json({ message: 'Invalid credentials' });
                }

                const isPasswordValid = await bcrypt.compare(password, user.password);

                if (!isPasswordValid) {
                    console.log('Login failed: Invalid password');
                    return res.status(401).json({ message: 'Invalid credentials' });
                }

                const token = jwt.sign(
                    { userId: user._id, email: user.email },
                    JWT_SECRET,
                    { expiresIn: '1h' }
                );

                console.log('Login successful:', user.email);
                res.json({ 
                    token, 
                    user: { 
                        id: user._id,
                        nombre: user.nombre, 
                        email: user.email,
                        role: user.role // Include the user's role
                    } 
                });
            } catch (error) {
                console.error('Login error:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        // Signup route
        app.post('/api/signup', async (req: Request, res: Response) => {
            console.log('Signup attempt:', req.body.email);
            try {
                const { nombre, email, password, role } = req.body;
                const usersCollection = db.collection('users');

                const existingUser = await usersCollection.findOne({ email });
                if (existingUser) {
                    console.log('Signup failed: User already exists');
                    return res.status(400).json({ message: 'User already exists' });
                }

                const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

                const newUser = {
                    nombre,
                    email,
                    password: hashedPassword,
                    role: role || "Basic" // Set role to "Basic" only if not specified
                };

                console.log('New user data:', newUser);

                const result = await usersCollection.insertOne(newUser);

                const token = jwt.sign(
                    { userId: result.insertedId, email },
                    JWT_SECRET,
                    { expiresIn: '1h' }
                );

                const responseData = {
                    message: 'User created successfully',
                    token,
                    user: {
                        id: result.insertedId,
                        nombre,
                        email,
                        role: newUser.role
                    },
                };

                console.log('Signup successful. Response data:', responseData);
                res.status(201).json(responseData);
            } catch (error) {
                console.error('Signup error:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        // Update user information route
        app.put('/api/user/update', async (req: Request, res: Response) => {
            console.log('Update user attempt:', req.body.email);
            try {
                const { userId, nombre, email, currentPassword, newPassword } = req.body;
                const usersCollection = db.collection('users');

                // Validate userId
                if (!ObjectId.isValid(userId)) {
                    console.log('Update failed: Invalid userId');
                    return res.status(400).json({ message: 'Invalid userId format' });
                }

                // Verify user exists
                const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
                if (!user) {
                    console.log('Update failed: User not found');
                    return res.status(404).json({ message: 'User not found' });
                }

                // Prepare update object
                const updateObj: any = {};
                if (nombre) updateObj.nombre = nombre;
                if (email) updateObj.email = email;

                // Password change logic
                if (currentPassword && newPassword) {
                    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
                    if (!isPasswordValid) {
                        return res.status(401).json({ message: 'Invalid current password' });
                    }
                    updateObj.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
                } else if (currentPassword || newPassword) {
                    return res.status(400).json({ message: 'Both current and new password are required to change password' });
                }

                // Only proceed with update if there are fields to update
                if (Object.keys(updateObj).length > 0) {
                    const result = await usersCollection.updateOne(
                        { _id: new ObjectId(userId) },
                        { $set: updateObj }
                    );

                    if (result.modifiedCount === 0) {
                        return res.status(400).json({ message: 'No changes made' });
                    }

                    console.log('User updated successfully:', userId);
                    res.json({ message: 'User updated successfully' });
                } else {
                    res.status(400).json({ message: 'No valid fields to update' });
                }
            } catch (error) {
                console.error('Update user error:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        app.use('/api', credentialsRoutes);
        app.use('/api/donors', donorsRoutes); // Add this line
        app.use('/api/users', usersRoutes);

        const PORT = process.env.PORT || 5000;
        const options = {
            key: fs.readFileSync(path.join(__dirname, '..', 'key.pem')),
            cert: fs.readFileSync(path.join(__dirname, '..', 'cert.pem'))
        };

        https.createServer(options, app).listen(PORT, () => {
            console.log(`Server is running on https://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
