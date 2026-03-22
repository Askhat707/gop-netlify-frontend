// netlify/functions/check-key.js
// Проверяет ключ + email → создаёт сессию
// Переменные (Netlify → Site Settings → Environment Variables):
//   HF_SPACE_URL    = https://askhat777-gld-options-live-dashboar.hf.space
//   HF_TOKEN        = hf_xxxxxxxxxxxxxxxx
//   NETLIFY_SECRET  = (тот же что в HF Space Secrets)

const HF_SPACE_URL   = process.env.HF_SPACE_URL;
const HF_TOKEN       = process.env.HF_TOKEN;
const NETLIFY_SECRET = process.env.NETLIFY_SECRET;

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let body;
  try { body = JSON.parse(event.body); }
  catch { return { statusCode: 400, body: JSON.stringify({ valid: false, message: "Invalid JSON" }) }; }

  const { key, email } = body;
  if (!key || !email) {
    return { statusCode: 400, body: JSON.stringify({ valid: false, message: "Ключ и email обязательны" }) };
  }

  try {
    const r = await fetch(`${HF_SPACE_URL}/license/check-key`, {
      method: "POST",
      headers: {
        "Content-Type":    "application/json",
        "Authorization":   `Bearer ${HF_TOKEN}`,    // ← для приватного Space
        "X-Netlify-Secret": NETLIFY_SECRET,          // ← внутренняя защита
        "X-Forwarded-For": event.headers["x-forwarded-for"] || ""
      },
      body: JSON.stringify({ key: key.toUpperCase(), email: email.toLowerCase() })
    });

    const data = await r.json();
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    };
  } catch (err) {
    console.error("check-key error:", err);
    return {
      statusCode: 502,
      body: JSON.stringify({ valid: false, message: "Ошибка сервера. Попробуйте позже." })
    };
  }
};
