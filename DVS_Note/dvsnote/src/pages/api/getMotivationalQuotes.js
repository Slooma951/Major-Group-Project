import { connectToDatabase } from '../../lib/mongoUtil';
import { getCustomSession } from '../../lib/session';

const quotesDatabase = {
  Happy: [
    "Keep smiling, it makes people wonder what you’re up to.",
    "Happiness is the highest form of health.",
    "A joyful heart is the inevitable result of a heart burning with love.",
    "Do more of what makes you happy.",
    "Choose happiness daily and let it shine through."
  ],
  Sad: [
    "The sun will rise, and we will try again.",
    "Tough times don’t last, but tough people do.",
    "Crying is not a sign of weakness. It’s a sign of being human.",
    "Sometimes it's okay if the only thing you did today was breathe.",
    "Your current situation is not your final destination."
  ],
  Angry: [
    "Don’t let anger control you; channel it into progress.",
    "Patience is the art of keeping calm under stress.",
    "Speak when you are angry and you will make the best speech you will ever regret.",
    "Let go of anger before it takes hold of you.",
    "Every storm runs out of rain."
  ],
  Fearful: [
    "Courage is not the absence of fear, but the triumph over it.",
    "Fear is temporary. Regret is forever.",
    "Feel the fear and do it anyway.",
    "Don’t let your fear decide your future.",
    "You gain strength, courage and confidence by every experience in which you stop to look fear in the face."
  ],
  Calm: [
    "Keep calm and carry on.",
    "Inner peace begins the moment you let go of negativity.",
    "Be like water — calm, patient, yet powerful.",
    "Peace is not the absence of conflict, but the ability to cope with it.",
    "Sometimes the most productive thing you can do is relax."
  ],
  Neutral: [
    "Every day is a new beginning. Take a deep breath and start again.",
    "Stay positive, work hard, and make it happen.",
    "Progress, not perfection.",
    "You are doing better than you think.",
    "Small steps every day lead to big results."
  ],
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const session = await getCustomSession(req, res);
    const username = session?.user?.username;

    if (!username) {
      return res.status(200).json({
        success: true,
        quote: "Keep pushing forward and believe in yourself!",
        emotion: "Neutral",
      });
    }

    const db = await connectToDatabase();
    const [latestEntry] = await db
      .collection('journalEntries')
      .find({ username })
      .sort({ updatedAt: -1 })
      .limit(1)
      .toArray();

    const rawEmotion = latestEntry?.detectedEmotions?.[0] || 'Neutral';
    const normalizedEmotion =
      rawEmotion.charAt(0).toUpperCase() + rawEmotion.slice(1).toLowerCase();

    const emotion = quotesDatabase[normalizedEmotion] ? normalizedEmotion : 'Neutral';
    const quotes = quotesDatabase[emotion];
    const quote = quotes[Math.floor(Math.random() * quotes.length)];

    return res.status(200).json({ success: true, quote, emotion });
  } catch (error) {
    console.error('Error fetching motivational quote:', error);
    return res.status(200).json({
      success: true,
      quote: "No matter what happens, you are strong and capable.",
      emotion: "Neutral",
    });
  }
}
