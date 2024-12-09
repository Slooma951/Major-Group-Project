import { getCustomSession } from '../../lib/session';

export default async function handler(req, res) {
    const session = await getCustomSession(req, res);

    // Ensure the session has user data
    if (!session.user) {
        return res.status(401).json({ message: 'Session invalid or expired' });
    }

    // Return user data including the email
    res.status(200).json({
        user: {
            username: session.user.username,
            email: session.user.email,
        },
    });
}
