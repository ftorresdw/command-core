import { GoogleLogin, type CredentialResponse } from '@react-oauth/google'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { PRODUCTION_HOST } from '../../auth/env'
import { BrandLogo } from '../../components/Brand/BrandLogo'
import styles from './LoginPage.module.css'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

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

        {googleClientId ? (
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
              Add <code>VITE_GOOGLE_CLIENT_ID</code> to your production environment to enable
              Google sign-in.
            </p>
            <p className={styles.setupHint}>
              See <code>GOOGLE_OAUTH.md</code> for setup steps. Add{' '}
              <code>https://{PRODUCTION_HOST}</code> as an authorized JavaScript origin.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
