import { getCustomSession } from '../../lib/session';

export default async function handler(req, res) {
    const session = await getCustomSession(req, res);

    if (!session.user) {
        return res.status(401).json({ message: 'Session invalid or expired' });
    }

    res.status(200).json({ user: session.user });
}