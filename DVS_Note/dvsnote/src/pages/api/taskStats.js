import { connectToDatabase } from '../../lib/mongoUtil';
import { getCustomSession } from '../../lib/session';
import dayjs from 'dayjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const session = await getCustomSession(req, res);
    if (!session?.user?.email) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { range } = req.body;
    const db = await connectToDatabase();
    const userId = session.user.email;

    const today = dayjs();
    let fromDate;
    switch (range) {
      case 'daily': fromDate = today.startOf('day'); break;
      case 'weekly': fromDate = today.startOf('week'); break;
      case 'monthly': fromDate = today.startOf('month'); break;
      case 'yearly': fromDate = today.startOf('year'); break;
      default: fromDate = today.subtract(1, 'month');
    }

    const allTasks = await db.collection('todo').find({
      userId,
      date: { $gte: fromDate.format('YYYY-MM-DD') },
    }).toArray();

    const completedTasks = allTasks.filter(task => task.status === 'Completed').length;
    const pendingTasks = allTasks.filter(task => task.status === 'Pending').length;

    return res.status(200).json({
      success: true,
      completedTasks,
      pendingTasks,
      totalTasks: allTasks.length,
    });
  } catch (err) {
    console.error('Error getting task stats:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}