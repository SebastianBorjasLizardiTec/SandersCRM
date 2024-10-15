import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { connectToMongo } from '../index';
import { ObjectId } from 'mongodb';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'secret-keyy';
const SALT_ROUNDS = 10;

router.post('/login', async (req: Request, res: Response) => {
    console.log('Login attempt:', req.body.email);
    let db;
    try {
        db = await connectToMongo();
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

router.post('/signup', async (req: Request, res: Response) => {
    console.log('Signup attempt:', req.body.email);
    let db;
    try {
        db = await connectToMongo();
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

export default router;
