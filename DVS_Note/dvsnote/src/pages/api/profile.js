import connectToDatabase from '../../lib/mongoUtil';
import bcrypt from 'bcryptjs';
import { getCustomSession } from '../../lib/session';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { action, currentPassword, newPassword, newUsername, newEmail } = req.body;

    if (!action) {
        return res.status(400).json({ success: false, message: 'Action is required.' });
    }

    try {
        const db = await connectToDatabase();
        const usersCollection = db.collection('users');

        const session = await getCustomSession(req, res);
        if (!session?.user?.username) {
            return res.status(401).json({ success: false, message: 'Unauthorized.' });
        }

        const user = await usersCollection.findOne({ username: session.user.username });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User does not exist.' });
        }

        if (action === 'updatePassword') {
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
            if (!newUsername) {
                return res.status(400).json({ success: false, message: 'New username is required.' });
            }

            if (newUsername === user.username) {
                return res.status(400).json({ success: false, message: 'New username cannot be the same as the current username.' });
            }

            const existingUsername = await usersCollection.findOne({ username: newUsername });
            if (existingUsername) {
                return res.status(400).json({ success: false, message: 'Username is already taken.' });
            }

            await usersCollection.updateOne(
                { username: user.username },
                { $set: { username: newUsername } }
            );

            session.user.username = newUsername;
            await session.save();

            return res.status(200).json({ success: true, message: 'Username updated successfully.' });
        } else if (action === 'updateEmail') {
            if (!newEmail) {
                return res.status(400).json({ success: false, message: 'New email is required.' });
            }

            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(newEmail)) {
                return res.status(400).json({ success: false, message: 'Invalid email format. Please use a valid email address.' });
            }

            const emailExists = await usersCollection.findOne({ email: newEmail });
            if (emailExists) {
                return res.status(400).json({ success: false, message: 'Email is already registered.' });
            }

            await usersCollection.updateOne(
                { username: user.username },
                { $set: { email: newEmail } }
            );

            session.user.email = newEmail;
            await session.save();

            return res.status(200).json({ success: true, message: 'Email updated successfully.' });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid action.' });
        }
    } catch (error) {
        console.error('Error in profile update:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
}