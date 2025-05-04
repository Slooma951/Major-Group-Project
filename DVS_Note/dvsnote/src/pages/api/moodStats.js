import { connectToDatabase } from '../../lib/mongoUtil';
import { getCustomSession } from '../../lib/session';
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

    const db = await connectToDatabase();
    const username = session.user.username;
    const { range } = req.body;

    const today = dayjs();
    let fromDate;

    switch (range) {
      case 'daily':
        fromDate = today.startOf('day');
        break;
      case 'weekly':
        fromDate = today.startOf('week');
        break;
      case 'monthly':
        fromDate = today.startOf('month');
        break;
      case 'yearly':
        fromDate = today.startOf('year');
        break;
      default:
        fromDate = today.subtract(1, 'month');
    }

    const docs = await db.collection('journalEntries').find({
      username,
      date: { $gte: fromDate.format('YYYY-MM-DD') },
    }).toArray();

    const moodCount = {
      Great: 0,
      Good: 0,
      Okay: 0,
      'Not so good': 0,
    };

    for (const entry of docs) {
      const mood = entry.mood;
      if (moodCount.hasOwnProperty(mood)) {
        moodCount[mood]++;
      }
    }

    return res.status(200).json({ success: true, moodCount });
  } catch (err) {
    console.error('Error fetching mood stats:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
