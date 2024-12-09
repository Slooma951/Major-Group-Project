import { connectToDatabase } from '../../lib/mongoUtil';
import { getCustomSession } from '../../lib/session';

const quotesDatabase = {
  Happy: [ "Keep smiling, it makes people wonder what you’re up to.", "Happiness is the highest form of health."],
  Sad: [ "The sun will rise, and we will try again.","Tough times don’t last, but tough people do."],
  Angry: ["Don’t let anger control you; channel it into progress.","Patience is the art of keeping calm under stress."],
  Fearful: ["Courage is not the absence of fear, but the triumph over it.","Fear is temporary. Regret is forever."],
  Calm: [ "Keep calm and carry on.","Inner peace begins the moment you let go of negativity." ],
  Neutral: ["Every day is a new beginning. Take a deep breath and start again.", "Stay positive, work hard, and make it happen." ],
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const session = await getCustomSession(req, res);

  // If no session or no username found, return neutral fallback
  if (!session || !session.user || !session.user.username) {
    return res.status(200).json({
      success: true,
      quote: "Keep pushing forward and believe in yourself!",
      emotion: "Neutral",
    });
  }

  const username = session.user.username;

  try {
    const db = await connectToDatabase();

    // Fetch the user's latest journal entry by username
    const [latestEntry] = await db
      .collection('journalEntries')
      .find({ username })
      .sort({ updatedAt: -1 })
      .limit(1)
      .toArray();

    if (!latestEntry) {
      // No entries found, neutral fallback
      return res.status(200).json({
        success: true,
        quote: "Today is a fresh start. Embrace it with optimism.",
        emotion: "Neutral",
      });
    }

    let primaryEmotion = 'Neutral';

    if (Array.isArray(latestEntry.detectedEmotions) && latestEntry.detectedEmotions.length > 0) {
      const rawEmotion = latestEntry.detectedEmotions[0];
      const normalizedEmotion = rawEmotion.charAt(0).toUpperCase() + rawEmotion.slice(1).toLowerCase();
      primaryEmotion = quotesDatabase[normalizedEmotion] ? normalizedEmotion : 'Neutral';
    }

    const quotes = quotesDatabase[primaryEmotion] || quotesDatabase.Neutral;
    const motivationalQuote = quotes[Math.floor(Math.random() * quotes.length)] || "Keep going, you're doing great!";

    return res.status(200).json({ success: true, quote: motivationalQuote, emotion: primaryEmotion });
  } catch (error) {
    console.error('Error fetching motivational quote:', error);
    // If error occurs, neutral fallback
    return res.status(200).json({
      success: true,
      quote: "No matter what happens, you are strong and capable.",
      emotion: "Neutral",
    });
  }
}