# Leads API

Command Core exposes `POST /api/leads` for the [Digital Weave contact form](https://digital-weave.vercel.app/contact) and `GET /api/leads` for the CRM.

Production base URL: `https://core.digitalweave.tech`

## 1. Vercel KV storage (required)

Leads are stored in **Vercel KV** (Upstash Redis).

1. Open the Command Core project in [Vercel Dashboard](https://vercel.com/dashboard).
2. Go to **Storage** → **Create Database** → choose **KV** or **Upstash Redis**.
3. Link it to the Command Core project.
4. Vercel will auto-set `KV_REST_API_URL` and `KV_REST_API_TOKEN`.

Redeploy after linking storage.

## 2. Vercel environment variables

| Variable | Projects | Notes |
|----------|----------|-------|
| `LEADS_API_SECRET` | Command Core + Digital Weave | Same secret on both |
| `KV_REST_API_URL` | Command Core | Auto-set by Vercel KV |
| `KV_REST_API_TOKEN` | Command Core | Auto-set by Vercel KV |
| `VITE_GOOGLE_CLIENT_ID` | Command Core | Google OAuth |

## 3. Contact form fields (website → API)

The API accepts the Digital Weave contact form fields:

| Contact form field | API field | Required |
|--------------------|-----------|----------|
| Name | `name` | Yes |
| Email | `email` | Yes |
| Company | `company` | No |
| Service Interested In | `service` | No |
| Message | `message` | Yes |
| Marketing opt-in | `marketingOptIn` | No |

Website submissions are stored with:

- `channel`: `Website`
- `status`: `New`
- `leadType`: `Inbound`
- `projectType`: value from `service` (defaults to `Other`)

### Example: JSON POST from the website

```ts
await fetch('https://core.digitalweave.tech/api/leads', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.LEADS_API_SECRET, // server-side only on the website
  },
  body: JSON.stringify({
    name: formData.name,
    email: formData.email,
    company: formData.company,
    service: formData.service,
    message: formData.message,
    marketingOptIn: formData.marketingOptIn,
  }),
})
```

**Important:** Do not put `LEADS_API_SECRET` in client-side website code. Call Command Core from a server route / API route on the Digital Weave site (e.g. Vercel serverless function) that adds the `x-api-key` header.

### Example: website API route (Digital Weave)

```ts
// digital-weave/api/contact.ts (or similar)
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { name, email, company, service, message, marketingOptIn } = req.body

  const response = await fetch('https://core.digitalweave.tech/api/leads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.LEADS_API_SECRET!,
    },
    body: JSON.stringify({ name, email, company, service, message, marketingOptIn }),
  })

  if (!response.ok) {
    const error = await response.json()
    return res.status(response.status).json(error)
  }

  const data = await response.json()
  return res.status(201).json(data)
}
```

## 4. CRM (Command Core)

The CRM page calls:

- `GET /api/leads` — list leads (same-origin, no API key required)
- `POST /api/leads?channel=manual` — add lead from the UI

## 5. Local development

| Command | Use case |
|---------|----------|
| `npm run dev` | Frontend only (API calls fail unless proxied) |
| `npm run dev:api` | Full stack with Vercel API routes (`vercel dev`) |

For `dev:api`, install Vercel CLI (`npm i -g vercel`) and add a `.env` file with KV + API secrets.

## 6. Test the endpoint

```bash
curl -X POST https://core.digitalweave.tech/api/leads \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_SECRET" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "company": "Acme Co",
    "service": "Website Development",
    "message": "Interested in a new site.",
    "marketingOptIn": true
  }'
```

```bash
curl https://core.digitalweave.tech/api/leads \
  -H "Origin: https://core.digitalweave.tech"
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `502` from `digital-weave.vercel.app/api/contact` | Command Core `/api/leads` is failing upstream. Check Command Core Vercel function logs. |
| `FUNCTION_INVOCATION_FAILED` on Command Core | Missing `@vercel/kv` package or KV not linked. Link KV storage and redeploy. |
| `503` + "Vercel KV is not configured" | Link a KV / Upstash Redis database to the Command Core Vercel project. |
| `401 Unauthorized` on POST | `LEADS_API_SECRET` mismatch between Digital Weave and Command Core. |

## Field aliases

The API also accepts these alternate keys:

- `name` → `contactName`, `contact`
- `email` → `contactEmail`
- `company` → `companyName`
- `service` → `serviceInterestedIn`, `projectType`
- `marketingOptIn` → `marketing_opt_in`, `updatesOptIn`

## CORS

Allowed origins for browser POST from the website:

- `https://digital-weave.vercel.app`
- `https://digitalweave.tech`
- `https://www.digitalweave.tech`
- `https://core.digitalweave.tech`

Prefer routing website submissions through a server-side proxy (section 3) instead of calling Command Core directly from the browser.
