// api/send-telegram.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).send('Message is required');
  }

  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('Telegram bot token or chat ID is missing.');
    return res.status(500).json({ error: 'Server configuration error: Telegram credentials missing.' });
  }

  const params = {
    chat_id: TELEGRAM_CHAT_ID,
    text: message,
    parse_mode: 'HTML'
  };

  try {
    const response = await fetch(TELEGRAM_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    const data = await response.json();

    if (!data.ok) {
      console.error('Telegram API error:', data.description);
      return res.status(500).json({ error: 'Failed to send message to Telegram', details: data.description });
    } else {
      console.log('Message sent to Telegram successfully!');
      return res.status(200).json({ success: true });
    }
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
