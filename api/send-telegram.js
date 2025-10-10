export default async function handler(req, res) {
  // Chỉ cho phép POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Lấy thông tin từ biến môi trường (Vercel)
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('❌ Missing Telegram credentials in environment variables.');
    return res.status(500).json({ error: 'Missing Telegram credentials in server configuration.' });
  }

  const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  // Cấu hình payload gửi tới Telegram
  const payload = {
    chat_id: TELEGRAM_CHAT_ID,
    text: message,
    parse_mode: "HTML", // ⚡ Đây là dòng quan trọng để hiển thị <b>, <code>, v.v.
    disable_web_page_preview: true
  };

  try {
    const telegramResponse = await fetch(TELEGRAM_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await telegramResponse.json();

    if (!telegramResponse.ok || !result.ok) {
      console.error('❌ Telegram API Error:', result);
      return res.status(500).json({
        success: false,
        error: result.description || 'Failed to send message to Telegram'
      });
    }

    console.log('✅ Message sent to Telegram successfully!');
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('⚠️ Error sending message to Telegram:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
