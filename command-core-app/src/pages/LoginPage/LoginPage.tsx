import { GoogleLogin, type CredentialResponse } from '@react-oauth/google'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { PRODUCTION_HOST } from '../../auth/env'
import { getGoogleClientId, isGoogleClientIdConfigured } from '../../auth/googleAuth'
import { BrandLogo } from '../../components/Brand/BrandLogo'
import styles from './LoginPage.module.css'

const googleClientId = getGoogleClientId()
const googleClientReady = isGoogleClientIdConfigured()

export function LoginPage() {
  const { user, signIn, authRequired } = useAuth()

  if (!authRequired || user) {
    return <Navigate to="/crm" replace />
  }

  function handleSuccess(response: CredentialResponse) {
    if (response.credential) {
      signIn(response.credential)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <BrandLogo variant="full" className={styles.logo} />
        <p className={styles.description}>
          Sign in with your Digital Weave Google account to access the workspace.
        </p>

        {googleClientReady ? (
          <div className={styles.googleButtonWrap}>
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => undefined}
              theme="filled_black"
              size="large"
              text="signin_with"
              shape="rectangular"
              width="320"
            />
          </div>
        ) : (
          <div className={styles.setupNote}>
            <p>
              {googleClientId
                ? 'The configured Google OAuth client ID is invalid. Use the Client ID from Google Cloud Console (not the client secret).'
                : 'Add VITE_GOOGLE_CLIENT_ID to your production environment before building.'}
            </p>
            <p className={styles.setupHint}>
              Vite embeds env vars at <strong>build time</strong> — set the variable in your host,
              then trigger a new deploy. See <code>GOOGLE_OAUTH.md</code>. Add{' '}
              <code>https://{PRODUCTION_HOST}</code> as an authorized JavaScript origin.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
