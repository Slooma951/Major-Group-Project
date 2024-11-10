// pages/api/saveJournalEntry.js
import connectToDatabase from '../../lib/mongoUtil';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { journalEntry, userName } = req.body;
            const db = await connectToDatabase();
            const collection = db.collection('JournalEntries');

            await collection.insertOne({
                userName,
                entry: journalEntry,
                createdAt: new Date(),
            });

            res.status(200).json({ success: true });
        } catch (error) {
            console.error('Database insertion error:', error);
            res.status (500).json({ success: false, error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
