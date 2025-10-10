// Example Node.js / Serverless Function to send message to Telegram
const fetch = require('node-fetch'); // Nếu Serverless hỗ trợ fetch, có thể bỏ require

// Thay bằng Token Bot Telegram của bạn
const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE';
const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID_HERE';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ success: false, error: 'Message is required' });
        }

        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });
        const data = await response.json();

        if (!data.ok) {
            return res.status(500).json({ success: false, error: data.description });
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error sending Telegram message:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}
