# Homeopathy Clinic Website (Cloudflare starter)

A responsive clinic website starter for **Cloudflare Pages + Pages Functions + D1**.

## Included
- Home, Doctor, Feedback, Contact and Admin Login sections
- Feedback and contact forms backed by Pages Functions
- D1 schema for feedback and contact enquiries
- Admin feedback moderation API protected by a Cloudflare Access-style bearer secret (starter protection)
- No admin password or secret is hardcoded

> Before using this publicly, finish the production authentication setup described below. This starter intentionally does not ship with a shared/default admin password.

## 1. Add your clinic details
Edit `public/index.html` and replace all `[PLACEHOLDER]` values:
- clinic name, doctor name, verified qualifications
- address, phone, email, timings
- real clinic description and profile photo

Do not publish unverified qualifications, fake testimonials, or unsupported cure claims.

## 2. Create the D1 database
Install Wrangler and log in:

```bash
npm install
npx wrangler login
npx wrangler d1 create homeopathy-clinic-db
```

Copy the returned `database_id` into `wrangler.toml`, replacing `REPLACE_WITH_D1_DATABASE_ID`.

Apply schema:

```bash
npx wrangler d1 execute homeopathy-clinic-db --file=./schema.sql
```

## 3. Configure secrets
Set a long, unique admin API secret (do not reuse a password shared in chat):

```bash
npx wrangler pages secret put ADMIN_API_TOKEN
```

For this starter, the admin moderation endpoint checks the `Authorization: Bearer ...` header. The browser admin panel asks for this token at runtime and keeps it only in sessionStorage. This is a minimal starter mechanism, not a complete identity system. For a public production clinic site, protect `/admin` and `/api/admin/*` with **Cloudflare Access** or implement a proper password-hash + secure-cookie session system before launch.

Optional Turnstile:
- Create a Turnstile site in Cloudflare.
- Set `TURNSTILE_SECRET_KEY` as a Pages secret.
- Add your public site key in `public/index.html` and wire client verification before enabling the form in production.

## 4. Local development
```bash
npm install
npm run dev
```

## 5. Deploy to Cloudflare Pages
```bash
npm run deploy
```

In Cloudflare Pages project settings:
- Build command: `npm run build`
- Build output directory: `public`
- Bind D1 database with binding name `DB`
- Add the `ADMIN_API_TOKEN` secret
- Add your custom domain after testing

## API routes
- `POST /api/feedback` — create pending feedback
- `POST /api/contact` — create contact enquiry
- `GET /api/admin/feedback` — list feedback (admin token required)
- `PATCH /api/admin/feedback` — update feedback status (admin token required)
- `DELETE /api/admin/feedback?id=...` — delete feedback (admin token required)

## Important production checklist
- Put the admin area behind Cloudflare Access (recommended).
- Replace the starter bearer-token admin flow with Cloudflare Access identity validation or a proper server-side session system.
- Configure Turnstile and rate limiting.
- Add privacy policy, data retention, and consent wording appropriate to your location.
- Test every endpoint and ensure secrets never appear in frontend source or browser network responses.
