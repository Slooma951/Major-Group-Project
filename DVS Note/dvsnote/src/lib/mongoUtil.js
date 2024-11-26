// mongoUtil.js
import { MongoClient } from 'mongodb';

//const uri = process.env.DB_URI; // Ensure this is correctly configured in your .env.local file
const client = new MongoClient('mongodb+srv://root:R5lcPSJm1egBE0Z1@dvsnotedb.lozto.mongodb.net/DVSDB?retryWrites=true&w=majority&appName=DVSNoteDB');

let dbConnection;

async function connectToDatabase() {
    if (!dbConnection) {
        try {
            await client.connect();
            dbConnection = client.db('DVSDB'); // Make sure 'DVSDB' is the correct database name
        } catch (error) {
            console.error("Database connection error:", error);
            throw error;
        }
    }
    return dbConnection;
}

export default connectToDatabase;
