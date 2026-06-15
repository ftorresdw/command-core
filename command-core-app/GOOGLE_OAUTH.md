# Google OAuth Setup for Command Core

Command Core uses [@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google) for Google Sign-In. Auth is **skipped on localhost** for local development and **required in production** at `https://core.digitalweave.tech`.

## 1. Create a Google Cloud project

1. Open [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or select an existing Digital Weave project).
3. Go to **APIs & Services → OAuth consent screen**.
4. Choose **Internal** (Google Workspace only) or **External** depending on who may sign in.
5. Fill in the app name (**Command Core**), support email, and save.

## 2. Create OAuth credentials

1. Go to **APIs & Services → Credentials**.
2. Click **Create credentials → OAuth client ID**.
3. Application type: **Web application**.
4. Name: `Command Core`.

### Authorized JavaScript origins

| Environment | Origin |
|-------------|--------|
| Production | `https://core.digitalweave.tech` |
| Local dev (optional, only if testing Google login locally) | `http://localhost:5173` |

### Authorized redirect URIs

Not required for the Google Identity Services button used in this app (popup / credential flow). If you add server-side OAuth later, configure redirect URIs then.

5. Click **Create** and copy the **Client ID** (ends in `.apps.googleusercontent.com`).

## 3. Configure the app

### Production

Set the environment variable where you deploy (Vercel, Netlify, etc.):

```env
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

Rebuild and redeploy so Vite embeds the variable at build time.

### Local development (optional)

Auth is bypassed on `localhost` by default. To test the real Google button locally:

1. Copy `.env.example` to `.env` in `command-core-app/`:

   ```bash
   cp .env.example .env
   ```

2. Set your client ID in `.env`:

   ```env
   VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   ```

3. Add `http://localhost:5173` as an authorized JavaScript origin in Google Cloud Console.

4. Restart the dev server:

   ```bash
   npm run dev
   ```

## 4. Restrict sign-in (recommended)

In Google Cloud Console, under the OAuth consent screen:

- Set **User type** to **Internal** if only `@digitalweave.tech` (or your Workspace domain) should access Command Core.
- Or use **External** with **Test users** during development.

For stricter control, validate the email domain in `src/auth/AuthContext.tsx` after decoding the Google JWT.

## 5. Verify production

1. Deploy to `https://core.digitalweave.tech` with `VITE_GOOGLE_CLIENT_ID` set.
2. Visit the site — you should see the login page with **Sign in with Google**.
3. After signing in, your name and email appear in the top bar.
4. **Sign out** returns you to the login page.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `origin_mismatch` | Add the exact origin (scheme + host + port) to **Authorized JavaScript origins**. |
| Button does not appear | Ensure `VITE_GOOGLE_CLIENT_ID` is set and the app was rebuilt after adding it. |
| Login skipped locally | Expected — auth is disabled on `localhost` / `127.0.0.1`. |
| `Access blocked` | Complete the OAuth consent screen or add the user as a test user. |

## Related files

- `src/auth/AuthContext.tsx` — session handling
- `src/auth/env.ts` — localhost bypass vs production host
- `src/pages/LoginPage/LoginPage.tsx` — Google Sign-In UI
- `src/main.tsx` — `GoogleOAuthProvider` wrapper
