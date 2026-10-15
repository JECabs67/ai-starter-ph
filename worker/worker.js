// Cloudflare Worker: newsletter signup -> Resend audience.
// Secret: RESEND_API_KEY (wrangler secret put RESEND_API_KEY). Var: AUDIENCE_ID.
const ALLOWED = "https://jecabs67.github.io";
const cors = { "Access-Control-Allow-Origin": ALLOWED, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Vary": "Origin" };
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

export default {
  async fetch(req, env) {
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (req.method !== "POST") return json({ ok: false, error: "method" }, 405);
    if (req.headers.get("Origin") !== ALLOWED) return json({ ok: false, error: "origin" }, 403);
    let data; try { data = await req.json(); } catch { return json({ ok: false, error: "bad json" }, 400); }
    if (data.website) return json({ ok: true }); // honeypot: pretend success for bots
    const email = String(data.email || "").trim().toLowerCase();
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return json({ ok: false, error: "email" }, 400);
    const r = await fetch(`https://api.resend.com/audiences/${env.AUDIENCE_ID}/contacts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email, unsubscribed: false })
    });
    return r.ok ? json({ ok: true }) : json({ ok: false, error: "upstream" }, 502);
  }
};
