// /api/notify.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  try {
    const payload = req.body;

    // --- Cấu hình ---
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    const WEBHOOK_URL = "https://your-webhook-endpoint.com/receive"; // thay bằng webhook thật

    // --- Gửi đến Telegram ---
    const telegramMessage = `
📢 New Form Submission:
Name: ${payload.name}
Email: ${payload.email}
Message: ${payload.message}
Time: ${new Date().toISOString()}
    `;

    const telegramResp = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: telegramMessage,
        }),
      }
    );

    // --- Gửi đến Webhook ---
    const webhookResp = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // --- Kiểm tra kết quả ---
    if (!telegramResp.ok) {
      throw new Error("Telegram send failed");
    }
    if (!webhookResp.ok) {
      throw new Error("Webhook send failed");
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Notify error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
