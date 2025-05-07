import { connectToDatabase } from '../../lib/mongoUtil';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { username, date } = req.body;

    if (!username || !date) {
      return res.status(400).json({ success: false, message: 'Missing username or date' });
    }

    const db = await connectToDatabase();
    const formattedDate =
      typeof date === 'string' ? date : new Date(date).toISOString().split('T')[0];

    // Try journals collection first
    const journal = await db.collection('journals').findOne({ username, date: formattedDate })
      || await db.collection('journalEntries').findOne({ username, date: formattedDate });

    if (!journal) {
      return res.status(404).json({ success: false, message: 'Journal entry not found' });
    }

    return res.status(200).json({
      success: true,
      journal: {
        content: journal.content || journal.journalEntry || '',
        mood: journal.mood || (journal.detectedEmotions?.[0] || ''),
      },
    });
  } catch (error) {
    console.error('Error retrieving journal:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
