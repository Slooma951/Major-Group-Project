import { connectToDatabase } from '../../lib/mongoUtil';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        // Extracting data from the request body
        const { username, transcript, date } = req.body;

        // Check if required fields are present
        if (!username || !date || !transcript) {
            console.error('Missing required fields:', { username, date, transcript });
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // Connect to the database
        const db = await connectToDatabase();

        // Save the voice transcript to the 'voiceRecords' collection
        await db.collection('voiceRecords').updateOne(
            { username, date },
            { $set: { transcript } },
            { upsert: true }
        );

        console.log('Voice transcript saved successfully:', { username, transcript, date });
        return res.status(200).json({ success: true, message: 'Voice transcript saved successfully' });
    } catch (error) {
        console.error('Error saving voice transcript:', error);
        return res.status(500).json({ success: false, message: 'Error saving voice transcript' });
    }
}
