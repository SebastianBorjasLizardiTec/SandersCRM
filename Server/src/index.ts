import express, { Request, Response } from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error('MongoDB URI not found in environment variables');
    process.exit(1);
}

const client = new MongoClient(uri);

async function connectToMongo() {
    try {
        await client.connect();
        console.log('Successfully connected to MongoDB');
        return client.db('CRM'); // Asegúrate de que 'CRM' es el nombre correcto de tu base de datos
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

function generateToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
}

app.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const db = await connectToMongo();
    const usersCollection = db.collection('users');

    try {
        const user = await usersCollection.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (password !== user.password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken();

        res.json({ 
            token, 
            user: { 
                id: user._id, 
                nombre: user.nombre, 
                email: user.email 
            } 
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        await client.close();
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});