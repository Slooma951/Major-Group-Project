import connectToDatabase from '../../lib/mongoUtil';
import bcrypt from 'bcryptjs';
import { getCustomSession } from '../../lib/session';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { username, password } = req.body;

    // Validate input
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
            return res.status(404).json({ success: false, message: 'User does not exist.' });
        }

        // Validate the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid password.' });
        }

        // Initialize session and store user data, including email
        const session = await getCustomSession(req, res);
        session.user = { username: user.username, email: user.email };
        await session.save();

        // Respond with success
        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: { username: user.username, email: user.email },
        });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
}
