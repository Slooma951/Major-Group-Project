import { connectToDatabase } from '../../lib/mongoUtil';

const motivationalQuotes = {
  Happy: ['Happiness is the key to success!', 'Smile and let the world wonder why!'],
  Sad: ['This too shall pass.', 'Stay strong; better days are coming.'],
  Angry: ['Anger is a temporary madness.', 'Peace begins with you.'],
  Fearful: ['Face your fears with courage.', 'Bravery is not the absence of fear.'],
  Calm: ['Breathe in peace, breathe out stress.', 'Calmness is the cradle of power.'],
  Neutral: ['Every day is a fresh start.', 'Progress, not perfection.'],
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ success: false, message: 'Username is required' });
    }

    const db = await connectToDatabase();

    // Get the latest journal entry with emotions
    const latestEntry = await db
      .collection('journalEntries')
      .findOne({ username }, { sort: { updatedAt: -1 } });

    if (!latestEntry || !latestEntry.detectedEmotions) {
      return res.status(404).json({ success: false, message: 'No journal entries with emotions found.' });
    }

    const detectedEmotions = latestEntry.detectedEmotions;

    // Fetch quotes for detected emotions
    const quotes = detectedEmotions
      .flatMap((emotion) => motivationalQuotes[emotion] || [])
      .slice(0, 3); // Limit to 3 quotes

    return res.status(200).json({
      success: true,
      quotes,
      emotions: detectedEmotions,
    });
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return res.status(500).json({ success: false, message: 'Error fetching quotes.' });
  }
}
