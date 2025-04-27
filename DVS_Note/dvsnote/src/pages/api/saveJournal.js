import { connectToDatabase } from '../../lib/mongoUtil';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { username, title, content, goals, date, mood } = req.body;

    if (!username || !date || (!content && !goals)) {
      console.error('Missing required fields:', { username, date, content, goals, mood });
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const db = await connectToDatabase();

    await db.collection('journals').updateOne(
      { username, date },
      { $set: { title, content, goals, mood } },
      { upsert: true }
    );

    console.log('Journal saved successfully:', { username, title, content, goals, mood, date });
    return res.status(200).json({ success: true, message: 'Journal saved successfully' });
  } catch (error) {
    console.error('Error saving journal:', error);
    return res.status(500).json({ success: false, message: 'Error saving journal' });
  }
}
