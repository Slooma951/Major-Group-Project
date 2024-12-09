import { connectToDatabase } from '../../lib/mongoUtil';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { username, date } = req.body;

    if (!username || !date) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const db = await connectToDatabase();
    const journal = await db.collection('journals').findOne({ username, date });

    if (!journal) {
      // Return a successful response with an empty journal structure
      return res.status(200).json({
        success: true,
        journal: null,
      });
    }

    return res.status(200).json({
      success: true,
      journal: { title: journal.title, content: journal.content },
    });
  } catch (error) {
    console.error('Error fetching journal:', error);
    return res.status(500).json({ success: false, message: 'Error fetching journal' });
  }
}
