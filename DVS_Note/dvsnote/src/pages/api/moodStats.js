import connectToDatabase from '../../lib/mongoUtil';
import { getCustomSession } from '../../lib/session';

export default async function handler(req, res) {
    try {
        const session = await getCustomSession(req, res);
        if (!session.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const db = await connectToDatabase();
        const journalCollection = db.collection('journal');
        const userId = session.user.email;

        const moods = await journalCollection.find({ username: session.user.username }).toArray();
        const moodCount = { Great: 0, Good: 0, Okay: 0, 'Not so good': 0 };

        moods.forEach(entry => {
            if (entry.mood && moodCount.hasOwnProperty(entry.mood)) {
                moodCount[entry.mood]++;
            }
        });

        res.status(200).json({ success: true, moodCount });
    } catch (error) {
        console.error("Error fetching mood stats:", error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
