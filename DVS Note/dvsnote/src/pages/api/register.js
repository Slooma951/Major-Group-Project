import { connectToDatabase } from '../../lib/mongoUtil';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { username, email, password } = req.body;

            // Ensure all fields are provided
            if (!username || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'All fields are required',
                });
            }

            const dbConnection = await connectToDatabase();
            const usersCollection = dbConnection.collection('users');

            // Check if username or email already exists
            const existingUser = await usersCollection.findOne({
                $or: [{ username }, { email }],
            });

            if (existingUser) {
                if (existingUser.username === username) {
                    return res.status(400).json({
                        success: false,
                        message: 'Username is already taken',
                    });
                }
                if (existingUser.email === email) {
                    return res.status(400).json({
                        success: false,
                        message: 'Email is already registered',
                    });
                }
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert the new user
            const result = await usersCollection.insertOne({
                username,
                email,
                password: hashedPassword,
            });

            if (result.acknowledged) {
                res.status(200).json({ success: true, message: 'User registered successfully' });
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
