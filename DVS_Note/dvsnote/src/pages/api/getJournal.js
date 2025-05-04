import { getCustomSession } from '../../lib/session';
import connectToDatabase from '../../lib/mongoUtil';
import dayjs from 'dayjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const session = await getCustomSession(req, res);
    if (!session.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { range = 'yearly' } = req.body;
    const db = await connectToDatabase();
    const todoCollection = db.collection('todo');
    const userId = session.user.email;

    const now = dayjs();
    let startDate;

    switch (range) {
      case 'daily':
        startDate = now.startOf('day').toDate();
        break;
      case 'weekly':
        startDate = now.startOf('week').toDate();
        break;
      case 'monthly':
        startDate = now.startOf('month').toDate();
        break;
      case 'yearly':
      default:
        startDate = now.startOf('year').toDate();
    }

    const tasks = await todoCollection.find({
      userId,
      createdAt: { $gte: startDate }
    }).toArray();

    // If you support `completed: true/false`, you can use this:
    const completedTasks = tasks.filter(t => t.completed === true).length;
    const pendingTasks = tasks.length - completedTasks;

    return res.status(200).json({
      success: true,
      totalTasks: tasks.length,
      completedTasks,
      pendingTasks
    });
  } catch (error) {
    console.error('Error getting task stats:', error);
    return res.status(500).json({ success: false, message: 'Error retrieving stats' });
  }
}
