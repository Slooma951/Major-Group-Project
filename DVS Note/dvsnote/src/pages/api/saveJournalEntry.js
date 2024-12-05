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
    const { username, content, date } = req.body;

    if (!username || !date || !content) {
      console.error('Missing required fields:', { username, date, content });
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const db = await connectToDatabase();

    // Analyze emotions, keywords, and sentiment
    const detectedEmotions = detectEmotions(content);
    const keywords = extractKeywords(content);
    const sentimentScore = calculateSentimentScore(content);

    // Save the analysis to the 'journalEntries' collection
    await db.collection('journalEntries').updateOne(
      { username, date },
      {
        $set: {
          journalEntry: content,
          detectedEmotions,
          keywords,
          sentimentScore,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    console.log('Emotion analysis saved successfully:', { username, detectedEmotions, sentimentScore });
    return res.status(200).json({ success: true, message: 'Emotion analysis saved successfully' });
  } catch (error) {
    console.error('Error saving emotion analysis:', error);
    return res.status(500).json({ success: false, message: 'Error saving emotion analysis' });
  }
}
