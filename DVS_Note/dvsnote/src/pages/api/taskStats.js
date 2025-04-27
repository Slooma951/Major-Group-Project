import connectToDatabase from '../../lib/mongoUtil';
import { getCustomSession } from '../../lib/session';

export default async function handler(req, res) {
    try {
        const session = await getCustomSession(req, res);
        if (!session.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const db = await connectToDatabase();
        const todoCollection = db.collection('todo');
        const userId = session.user.email;

        const totalTasks = await todoCollection.countDocuments({ userId });
        const completedTasks = await todoCollection.countDocuments({ userId, completed: true });
        const pendingTasks = totalTasks - completedTasks;

        res.status(200).json({ success: true, totalTasks, completedTasks, pendingTasks });
    } catch (error) {
        console.error("Error fetching task stats:", error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
