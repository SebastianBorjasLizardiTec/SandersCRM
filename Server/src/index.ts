import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import path from 'path';
import credentialsRoutes from './routes/credentials';
import donorsRoutes from './routes/donors';
import usersRoutes from './routes/users';
import donationsRoutes from './routes/donations';

dotenv.config();

console.log('Starting server...');

const app = express();
app.use(express.json());
const uri = process.env.MONGODB_URI || "mongodb+srv://admin:4dm1n_@crm.t2lqy.mongodb.net/";

app.use(cors({
    exposedHeaders: ['X-Total-Count'],
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

const startServer = async () => {
    try {
        await connectToMongo();

        app.use('/api', credentialsRoutes);
        app.use('/api/donors', donorsRoutes);
        app.use('/api/users', usersRoutes);
        app.use('/api/donations', donationsRoutes);

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