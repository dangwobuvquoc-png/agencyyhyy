// api/send-telegram.js
import axios from 'axios';

export default async function handler(req, res) {
    // Chỉ cho phép POST
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }

    const { message } = req.body;

    // Kiểm tra message
    if (!message) {
        return res.status(400).json({ success: false, error: 'Message is required' });
    }

    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    // Kiểm tra biến môi trường
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.error('Telegram credentials missing!');
        return res.status(500).json({ success: false, error: 'Server configuration error: Telegram credentials missing.' });
    }

    const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    try {
        const response = await axios.post(TELEGRAM_API_URL, {
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        });

        if (response.data.ok) {
            console.log('✅ Message sent successfully!');
            return res.status(200).json({ success: true });
        } else {
            console.error('❌ Telegram API error:', response.data.description);
            return res.status(500).json({ success: false, error: 'Failed to send message', details: response.data.description });
        }
