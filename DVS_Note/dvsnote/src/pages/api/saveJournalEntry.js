import { connectToDatabase } from '../../lib/mongoUtil';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, content, mood, date } = req.body;

    if (!username || !content) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const db = await connectToDatabase();
    const stringDate = typeof date === 'string' ? date : new Date(date).toISOString().split('T')[0];

    await db.collection('journalEntries').updateOne(
        { username, date: stringDate },
        { $set: { username, date: stringDate, content, mood } },
        { upsert: true }
    );

    res.status(200).json({ message: 'Journal entry saved successfully' });
  } catch (error) {
    console.error('Error saving journal entry:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}