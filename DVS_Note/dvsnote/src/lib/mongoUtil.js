// mongoUtil.js
import { MongoClient } from 'mongodb';

const client = new MongoClient('mongodb+srv://root:R5lcPSJm1egBE0Z1@dvsnotedb.lozto.mongodb.net/DVSDB?retryWrites=true&w=majority&appName=DVSNoteDB');

let dbConnection;

export async function connectToDatabase() {
    if (!dbConnection) {
        const clientConnection = await client.connect();
        dbConnection = clientConnection.db('DVSDB');
    }
    return dbConnection;
}


export default connectToDatabase;
