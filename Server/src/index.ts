import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import credentialsRoutes from './routes/credentials';
import donorsRoutes from './routes/donors';

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

const startServer = async () => {
    try {
        await connectToMongo();
        app.use('/api', credentialsRoutes);
        app.use('/api/donors', donorsRoutes);

        const PORT = process.env.PORT || 5000;
        const options = {
            key: fs.readFileSync('C:/Users/emili/Documents/GitHub/Redes2/SandersCRM/Server/key.pem'),
            cert: fs.readFileSync('C:/Users/emili/Documents/GitHub/Redes2/SandersCRM/Server/cert.pem')
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