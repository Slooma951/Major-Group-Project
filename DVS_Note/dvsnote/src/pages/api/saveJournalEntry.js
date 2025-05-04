import { connectToDatabase } from '../../lib/mongoUtil';

const detectEmotions = (text) => {
  const emotionKeywords = {
    Happy: ['happy', 'joy', 'excited', 'cheerful', 'love', 'laugh', 'smile'],
    Sad: ['sad', 'cry', 'depressed', 'unhappy', 'tears'],
    Angry: ['angry', 'mad', 'furious', 'upset', 'hate'],
    Fearful: ['scared', 'afraid', 'nervous', 'worried'],
    Calm: ['calm', 'relaxed', 'peaceful'],
  };

  const detectedEmotions = [];
  const lowerCaseText = text.toLowerCase();

  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    if (keywords.some((keyword) => lowerCaseText.includes(keyword))) {
      detectedEmotions.push(emotion);
    }
  }

  return detectedEmotions.length > 0 ? detectedEmotions : ['Neutral'];
};

const extractKeywords = (text) => {
  const stopWords = ['is', 'the', 'and', 'a', 'an', 'of', 'to', 'with', 'on', 'in'];
  return text
    .split(/\s+/)
    .map((word) => word.toLowerCase().replace(/[^a-z]/g, ''))
    .filter((word) => word.length > 2 && !stopWords.includes(word));
};

const calculateSentimentScore = (text) => {
  const positiveWords = ['happy', 'joy', 'love', 'calm', 'peaceful'];
  const negativeWords = ['sad', 'angry', 'cry', 'nervous', 'tense'];

  const lowerCaseText = text.toLowerCase();
  let score = 0;

  positiveWords.forEach((word) => {
    if (lowerCaseText.includes(word)) score += 1;
  });
  negativeWords.forEach((word) => {
    if (lowerCaseText.includes(word)) score -= 1;
  });

  return score;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { username, content, date, mood } = req.body;

    if (!username || !date || !content || !mood) {
      console.error('Missing required fields:', { username, date, content, mood });
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const db = await connectToDatabase();

    const detectedEmotions = detectEmotions(content);
    const keywords = extractKeywords(content);
    const sentimentScore = calculateSentimentScore(content);

    const updateResult = await db.collection('journalEntries').updateOne(
      { username, date },
      {
        $set: {
          journalEntry: content,
          detectedEmotions,
          keywords,
          sentimentScore,
          mood,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    if (updateResult.acknowledged) {
      console.log('Journal entry saved with emotion and mood:', {
        username,
        date,
        mood,
        detectedEmotions,
        sentimentScore,
      });
      return res.status(200).json({
        success: true,
        message: 'Entry saved with mood and emotion analysis!',
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to save journal entry.',
      });
    }
  } catch (error) {
    console.error('Error saving journal entry:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
