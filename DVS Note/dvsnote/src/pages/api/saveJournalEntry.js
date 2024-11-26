import connectToDatabase from '../../lib/mongoUtil';
import { ObjectId } from 'mongodb';

// Emotion analysis helper (simple example, replace with ML for accuracy)
const detectEmotion = (text) => {
    const lowerCaseText = text.toLowerCase();
    if (lowerCaseText.includes('happy') || lowerCaseText.includes('excited')) return 'Happy';
    if (lowerCaseText.includes('sad') || lowerCaseText.includes('depressed')) return 'Sad';
    if (lowerCaseText.includes('angry') || lowerCaseText.includes('frustrated')) return 'Angry';
    return 'Neutral';
};

// Extract keywords (basic keyword extraction)
const extractKeywords = (text) => {
    const stopWords = ['is', 'the', 'and', 'a', 'an', 'of', 'to', 'with', 'on', 'in', 'at', 'for'];
    return text
        .split(/\s+/)
        .map((word) => word.toLowerCase().replace(/[^a-z]/g, ''))
        .filter((word) => word.length > 2 && !stopWords.includes(word));
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        const { userId, journalEntry } = req.body;

        if (!userId || !journalEntry) {
            return res.status(400).json({ success: false, message: 'User ID and journal entry are required.' });
        }

        const db = await connectToDatabase();
        const journalCollection = db.collection('journalEntries');

        // Detect emotion and extract keywords
        const detectedEmotion = detectEmotion(journalEntry);
        const keywords = extractKeywords(journalEntry);

        // Create the journal entry document
        const newEntry = {
            userId: new ObjectId(userId), // Ensure userId is a valid ObjectId
            journalEntry,
            detectedEmotion,
            keywords,
            createdAt: new Date(),
        };

        // Insert the document into the database
        const result = await journalCollection.insertOne(newEntry);

        if (result.acknowledged) {
            res.status(200).json({ success: true, message: 'Journal entry saved successfully.', entryId: result.insertedId });
        } else {
            res.status(500).json({ success: false, message: 'Failed to save journal entry.' });
        }
    } catch (error) {
        console.error('Error saving journal entry:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}
