import connectToDatabase from '../../lib/mongoUtil';
import { ObjectId } from 'mongodb';

const detectEmotions = (text) => {
    const emotionKeywords = {
        Happy: ['happy', 'joy', 'excited', 'cheerful', 'thrilled', 'love', 'laugh', 'smile'],
        Sad: ['sad', 'unhappy', 'down', 'depressed', 'cry', 'heartbroken', 'tears', 'blue'],
        Angry: ['angry', 'mad', 'frustrated', 'annoyed', 'furious', 'upset', 'irritated', 'hate'],
        Fearful: ['scared', 'afraid', 'nervous', 'worried', 'anxious', 'terrified', 'uneasy', 'tense'],
        Calm: ['calm', 'relaxed', 'peaceful', 'serene', 'content', 'chill', 'still', 'quiet'],
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
    const stopWords = [
        'is', 'the', 'and', 'a', 'an', 'of', 'to', 'with', 'on', 'in',
        'at', 'for', 'it', 'this', 'that', 'but', 'too', 'make',
    ];
    return text
        .split(/\s+/)
        .map((word) => word.toLowerCase().replace(/[^a-z]/g, ''))
        .filter((word) => word.length > 2 && !stopWords.includes(word));
};

const calculateSentimentScore = (text) => {
    const positiveWords = ['happy', 'joy', 'love', 'smile', 'excited', 'peaceful', 'calm', 'content'];
    const negativeWords = ['sad', 'angry', 'hate', 'cry', 'down', 'depressed', 'nervous', 'tense'];

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
        const { userId, journalEntry } = req.body;

        if (!userId || !journalEntry) {
            return res.status(400).json({
                success: false,
                message: 'User ID and journal entry are required.',
            });
        }

        const db = await connectToDatabase();
        const journalCollection = db.collection('journalEntries');

        const detectedEmotions = detectEmotions(journalEntry);
        const keywords = extractKeywords(journalEntry);
        const sentimentScore = calculateSentimentScore(journalEntry);

        const newEntry = {
            userId: new ObjectId(userId),
            journalEntry,
            detectedEmotions,
            keywords,
            sentimentScore,
            createdAt: new Date(),
        };

        const result = await journalCollection.insertOne(newEntry);

        if (result.acknowledged) {
            return res.status(200).json({
                success: true,
                message: 'journal entry saved successfully.',
                entryId: result.insertedId,
            });
        } else {
            return res.status(500).json({
                success: false,
                message: 'Failed to save journal entry.',
            });
        }
    } catch (error) {
        console.error('Error saving journal entry:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
}