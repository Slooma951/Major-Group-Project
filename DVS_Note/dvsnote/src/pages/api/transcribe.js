import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import { SpeechClient } from '@google-cloud/speech';

export const config = {
    api: { bodyParser: false }
};

let credentials = undefined;

if (process.env.GOOGLE_SERVICE_KEY_BASE64) {
    try {
        const jsonString = Buffer.from(process.env.GOOGLE_SERVICE_KEY_BASE64, 'base64').toString('utf8');
        credentials = JSON.parse(jsonString);
    } catch (e) {
        console.error('Failed to parse GOOGLE_SERVICE_KEY_BASE64:', e);
    }
}

const client = new SpeechClient({
    credentials
});

const parseForm = (req) =>
    new Promise((resolve, reject) => {
        const uploadDir = path.join(process.cwd(), '/tmp');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        const form = new IncomingForm({
            multiples: false,
            uploadDir,
            keepExtensions: true
        });

        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            else resolve({ fields, files });
        });
    });

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { files } = await parseForm(req);
        const audioFile = Array.isArray(files.audio) ? files.audio[0] : files.audio;

        if (!audioFile?.filepath) {
            return res.status(400).json({ error: 'No audio file received' });
        }

        const fileBuffer = fs.readFileSync(audioFile.filepath);
        const audioBytes = fileBuffer.toString('base64');

        const request = {
            audio: { content: audioBytes },
            config: {
                encoding: 'WEBM_OPUS',
                languageCode: 'en-US',
                enableAutomaticPunctuation: true,
            },
        };

        const [response] = await client.recognize(request);
        const transcript = response.results.map(r => r.alternatives[0].transcript).join(' ');

        return res.status(200).json({ transcript });
    } catch (error) {
        console.error('Google Speech error:', error);
        return res.status(500).json({ error: 'Transcription failed' });
    }
}