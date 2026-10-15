# Signup Worker
1. `npx wrangler login`
2. `npx wrangler secret put RESEND_API_KEY`
3. `npx wrangler deploy` (gives https://ai-starter-ph-signup.<subdomain>.workers.dev)
4. Put that URL in `CONFIG.signupEndpoint` in `../app.js` and push.
