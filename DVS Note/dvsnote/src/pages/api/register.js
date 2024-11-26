// src/pages/api/register.js
import connectToDatabase from '../../lib/mongoUtil';
import bcrypt from 'bcryptjs';
// mongoUtil.js
import { MongoClient } from 'mongodb';

export default async function handler(req, res) {

    const client = new MongoClient('mongodb+srv://root:R5lcPSJm1egBE0Z1@dvsnotedb.lozto.mongodb.net/DVSDB?retryWrites=true&w=majority&appName=DVSNoteDB');

   
      let dbConnection=  await client.connect();
        dbConnection = client.db('DVSDB'); // Make sure 'DVSDB' is the correct database name
   

    
    if (req.method === 'POST') {
        try {
           
            const { username, email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);

            const result = await dbConnection.collection('users').insertOne({
                username,
                email,
                password: hashedPassword,
            });

            if (result.acknowledged) {
                res.status(200).json({ success: true, message: 'User registered' });
            } else {
                res.status(400).json({ success: false, message: 'Registration failed' });
            }
        } catch (error) {
            console.error('Error in registration:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
