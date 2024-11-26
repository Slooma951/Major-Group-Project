// src/pages/api/login.js
import connectToDatabase from '../../lib/mongoUtil';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    // Allow only POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { username, password } = req.body;

    // Check if both username and password are provided
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    try {
        // Connect to the database
        const db = await connectToDatabase();
        const usersCollection = db.collection('users');

        // Check if user exists
        const user = await usersCollection.findOne({ username });
        if (!user) {
            return res.status(400).json({ success: false, message: 'User does not exist.' });
        }

        // Validate the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: 'Invalid password.' });
        }

        // If login is successful
        res.status(200).json({
            success: true,
            message: 'Login successful',
            userId: user._id,
        });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
}
