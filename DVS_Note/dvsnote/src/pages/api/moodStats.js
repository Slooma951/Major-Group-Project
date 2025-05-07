import { connectToDatabase } from '../../lib/mongoUtil';
import { getCustomSession } from '../../lib/session';
import dayjs from 'dayjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const session = await getCustomSession(req, res);
    const username = session?.user?.username;

    if (!username) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { range } = req.body;
    const db = await connectToDatabase();

    const today = dayjs();
    const fromDate = (() => {
      switch (range) {
        case 'daily': return today.startOf('day');
        case 'weekly': return today.startOf('week');
        case 'monthly': return today.startOf('month');
        case 'yearly': return today.startOf('year');
        default: return today.subtract(1, 'month');
      }
    })();

    const entries = await db.collection('journalEntries').find({
      username,
      date: { $gte: fromDate.format('YYYY-MM-DD') },
    }).toArray();

    const moodCount = {
      Motivated: 0,
      Content: 0,
      Reflective: 0,
      Stressed: 0,
    };

    for (const entry of entries) {
      const mood = entry.mood;
      if (mood && moodCount.hasOwnProperty(mood)) {
        moodCount[mood]++;
      }
    }

    return res.status(200).json({ success: true, moodCount });
  } catch (error) {
    console.error('Error fetching mood stats:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
