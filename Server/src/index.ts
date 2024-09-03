import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error('MongoDB URI not found in environment variables');
    process.exit(1);
}

const client = new MongoClient(uri);

async function connect() {
    try {
        await client.connect();
        console.log('Successfully connected to MongoDB');
        
        // Opcional: listar las bases de datos para confirmar la conexión
        const dbs = await client.db().admin().listDatabases();
        console.log('Databases:');
        dbs.databases.forEach(db => console.log(` - ${db.name}`));
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    } finally {
        await client.close();
    }
}

connect();