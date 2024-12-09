import connectToDatabase from '../../lib/mongoUtil';
import bcrypt from 'bcryptjs';
import { getCustomSession } from '../../lib/session';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { action, currentPassword, newPassword, newUsername, newEmail } = req.body;

    // Validate input
    if (!action) {
        return res.status(400).json({ success: false, message: 'Action is required.' });
    }

    try {
        // Connect to the database
        const db = await connectToDatabase();
        const usersCollection = db.collection('users');

        // Initialize session and get the logged-in user
        const session = await getCustomSession(req, res);
        if (!session?.user?.username) {
            return res.status(401).json({ success: false, message: 'Unauthorized.' });
        }

        const user = await usersCollection.findOne({ username: session.user.username });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User does not exist.' });
        }

        if (action === 'updatePassword') {
            // Validate the current and new password
            if (!currentPassword || !newPassword) {
                return res.status(400).json({ success: false, message: 'Current and new password are required.' });
            }

            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ success: false, message: 'Invalid current password.' });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await usersCollection.updateOne(
                { username: user.username },
                { $set: { password: hashedPassword } }
            );

            return res.status(200).json({ success: true, message: 'Password updated successfully.' });
        } else if (action === 'updateUsername') {
            // Validate the new username
            if (!newUsername) {
                return res.status(400).json({ success: false, message: 'New username is required.' });
            }

            await usersCollection.updateOne(
                { username: user.username },
                { $set: { username: newUsername } }
            );

            session.user.username = newUsername;
            await session.save();

            return res.status(200).json({ success: true, message: 'Username updated successfully.' });
        } else if (action === 'updateEmail') {
            // Validate the new email
            if (!newEmail) {
                return res.status(400).json({ success: false, message: 'New email is required.' });
            }

            await usersCollection.updateOne(
                { username: user.username },
                { $set: { email: newEmail } }
            );

            return res.status(200).json({ success: true, message: 'Email updated successfully.' });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid action.' });
        }
    } catch (error) {
        console.error('Error in profile update:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
}
