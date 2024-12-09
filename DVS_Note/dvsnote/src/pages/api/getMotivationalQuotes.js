import { connectToDatabase } from '../../lib/mongoUtil';

const quotesDatabase = {
  Happy: ["Keep smiling, it makes people wonder what you’re up to.", "Happiness is the highest form of health."],
  Sad: ["The sun will rise, and we will try again.", "Tough times don’t last, but tough people do."],
  Angry: ["Don’t let anger control you; channel it into progress.", "Patience is the art of keeping calm under stress."],
  Fearful: ["Courage is not the absence of fear, but the triumph over it.", "Fear is temporary. Regret is forever."],
  Calm: ["Keep calm and carry on.", "Inner peace begins the moment you let go of negativity."],
  Neutral: ["Every day is a new beginning. Take a deep breath and start again.", "Stay positive, work hard, and make it happen."],
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const db = await connectToDatabase();

    // Fetch the latest journal entry with emotions
    const latestEntry = await db
      .collection('journalEntries')
      .find({})
      .sort({ updatedAt: -1 }) // Sort by the most recent
      .limit(1)
      .toArray();

    if (!latestEntry || latestEntry.length === 0) {
      return res.status(404).json({ success: false, message: 'No journal entries found' });
    }

    const { detectedEmotions } = latestEntry[0];
    const primaryEmotion = detectedEmotions[0] || 'Neutral';

    // Select a random quote for the detected emotion
    const quotes = quotesDatabase[primaryEmotion];
    const motivationalQuote = quotes[Math.floor(Math.random() * quotes.length)];

    return res.status(200).json({ success: true, quote: motivationalQuote, emotion: primaryEmotion });
  } catch (error) {
    console.error('Error fetching motivational quote:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
