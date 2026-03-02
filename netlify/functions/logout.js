// netlify/functions/logout.js
const HF_SPACE_URL   = process.env.HF_SPACE_URL;
const HF_TOKEN       = process.env.HF_TOKEN;
const NETLIFY_SECRET = process.env.NETLIFY_SECRET;

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405 };
  const { token } = JSON.parse(event.body || "{}");
  try {
    await fetch(`${HF_SPACE_URL}/license/logout`, {
      method: "POST",
      headers: {
        "Content-Type":    "application/json",
        "Authorization":   `Bearer ${HF_TOKEN}`,
        "X-Netlify-Secret": NETLIFY_SECRET
      },
      body: JSON.stringify({ token })
    });
  } catch (_) {}
  return { statusCode: 200, body: JSON.stringify({ status: "ok" }) };
};
