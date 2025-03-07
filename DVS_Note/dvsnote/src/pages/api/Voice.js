export default function handler(req, res) {
    return res.status(405).json({ error: 'Voice recognition is handled on the client side.' });
}
