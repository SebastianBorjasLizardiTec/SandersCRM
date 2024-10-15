import express from 'express';
import { Request, Response } from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

dotenv.config();

console.log('Starting server...');

const app = express();
app.use(express.json());
app.use(cors());
const uri = process.env.MONGODB_URI;



if (!uri) {
    console.error('MONGODB_URI is not defined in the environment variables');
    process.exit(1);
}

const client = new MongoClient(uri);

connectToMongo().catch(console.error);

async function connectToMongo() {
    try {
        await client.connect();
        console.log('Connected successfully to MongoDB');
        const db = client.db('CRM');
        return db;
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
}

const JWT_SECRET = process.env.JWT_SECRET || 'secret-keyy';
const SALT_ROUNDS = 10;

app.post('/login', async (req: Request, res: Response) => {
    console.log('Login attempt:', req.body.email);
    let db;
    try {
        db = await connectToMongo();
        const { email, password } = req.body;
        const usersCollection = db.collection('users');

        try {
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
                    email: user.email 
                } 
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Internal server error' });
        } finally {
            if (db) {
                await client.close();
            }
        }
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/signup', async (req: Request, res: Response) => {
    console.log('Signup attempt:', req.body.email);
    let db;
    try {
        
        db = await connectToMongo();
        const { nombre, email, password } = req.body;
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
        };

        const result = await usersCollection.insertOne(newUser);

        const token = jwt.sign(
            { userId: result.insertedId, email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log('Signup successful:', email);
        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: result.insertedId,
                nombre,
                email,
            },
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        if (db) {
            await client.close();
        }
    }
});

const PORT = process.env.PORT || 5001;
const options = {
    key: fs.readFileSync('/Users/felipedearaujobarbosa/OneDrive - Instituto Tecnologico y de Estudios Superiores de Monterrey/Tec/reto_redes/SandersCRM/Server/key.pem'),
    cert: fs.readFileSync('/Users/felipedearaujobarbosa/OneDrive - Instituto Tecnologico y de Estudios Superiores de Monterrey/Tec/reto_redes/SandersCRM/Server/cert.pem')
};

https.createServer(options, app).listen(5001, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
});