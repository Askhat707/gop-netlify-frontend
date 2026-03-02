// netlify/functions/verify-session.js
const HF_SPACE_URL   = process.env.HF_SPACE_URL;
const HF_TOKEN       = process.env.HF_TOKEN;
const NETLIFY_SECRET = process.env.NETLIFY_SECRET;

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405 };

  const { token } = JSON.parse(event.body || "{}");
  if (!token) return { statusCode: 400, body: JSON.stringify({ valid: false }) };

  try {
    const r = await fetch(`${HF_SPACE_URL}/license/verify-session`, {
      method: "POST",
      headers: {
        "Content-Type":    "application/json",
        "Authorization":   `Bearer ${HF_TOKEN}`,
        "X-Netlify-Secret": NETLIFY_SECRET
      },
      body: JSON.stringify({ token })
    });
    const data = await r.json();
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return { statusCode: 502, body: JSON.stringify({ valid: false }) };
  }
};
