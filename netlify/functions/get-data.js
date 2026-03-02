// netlify/functions/get-data.js
// Проксирует /api/data из приватного HF Space
const HF_SPACE_URL   = process.env.HF_SPACE_URL;
const HF_TOKEN       = process.env.HF_TOKEN;
const NETLIFY_SECRET = process.env.NETLIFY_SECRET;

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") return { statusCode: 405 };

  const token = event.headers["x-session-token"] || "";
  if (!token) return { statusCode: 401, body: JSON.stringify({ error: "Нет токена" }) };

  try {
    const r = await fetch(`${HF_SPACE_URL}/api/data`, {
      headers: {
        "Authorization":   `Bearer ${HF_TOKEN}`,
        "X-Netlify-Secret": NETLIFY_SECRET,
        "X-Session-Token":  token
      }
    });
    const data = await r.json();
    return {
      statusCode: r.status,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return { statusCode: 502, body: JSON.stringify({ error: "Ошибка получения данных" }) };
  }
};
