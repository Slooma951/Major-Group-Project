import { connectToDatabase } from '../../lib/mongoUtil';

const emotionKeywords = {
  happy: 'Happy', joy: 'Happy', excited: 'Happy', cheerful: 'Happy', content: 'Happy',
  delighted: 'Happy', thrilled: 'Happy', optimistic: 'Happy', elated: 'Happy', pleased: 'Happy',

  sad: 'Sad', depressed: 'Sad', unhappy: 'Sad', down: 'Sad', gloomy: 'Sad',
  miserable: 'Sad', heartbroken: 'Sad', sorrow: 'Sad', blue: 'Sad', hopeless: 'Sad',

  angry: 'Angry', mad: 'Angry', furious: 'Angry', frustrated: 'Angry', irritated: 'Angry',
  annoyed: 'Angry', enraged: 'Angry', outraged: 'Angry', resentful: 'Angry',

  scared: 'Fearful', nervous: 'Fearful', anxious: 'Fearful', worried: 'Fearful',
  panicked: 'Fearful', uneasy: 'Fearful', insecure: 'Fearful', frightened: 'Fearful',

  calm: 'Calm', relaxed: 'Calm', peaceful: 'Calm', tranquil: 'Calm', serene: 'Calm',
  composed: 'Calm', at_ease: 'Calm', mellow: 'Calm', contented: 'Calm', settled: 'Calm',

  okay: 'Neutral', fine: 'Neutral', alright: 'Neutral', normal: 'Neutral',
  average: 'Neutral', indifferent: 'Neutral', meh: 'Neutral'
};

function detectEmotionsFromText(text) {
  const lowered = text.toLowerCase();
  const counts = {};

  for (const keyword in emotionKeywords) {
    if (lowered.includes(keyword)) {
      const emotion = emotionKeywords[keyword];
      counts[emotion] = (counts[emotion] || 0) + 1;
    }
  }

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return sorted.length > 0 ? [sorted[0][0]] : ['Neutral'];
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, title, content, mood, date } = req.body;

    if (!username || !content) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const db = await connectToDatabase();
    const stringDate = typeof date === 'string' ? date : new Date(date).toISOString().split('T')[0];
    const detectedEmotions = detectEmotionsFromText(content);

    await db.collection('journals').updateOne(
        { username, date: stringDate },
        {
          $set: {
            title,
            content,
            mood,
            detectedEmotions
          }
        },
        { upsert: true }
    );

    res.status(200).json({ message: 'Journal saved with emotion detection' });
  } catch (error) {
    console.error('Error saving journal:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}