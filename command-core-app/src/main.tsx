import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { getGoogleClientId, isGoogleClientIdConfigured } from './auth/googleAuth'

const googleClientId = getGoogleClientId()

function AppProviders(props: { children: React.ReactNode }) {
  if (!isGoogleClientIdConfigured()) {
    return <AuthProvider>{props.children}</AuthProvider>
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>{props.children}</AuthProvider>
    </GoogleOAuthProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProviders>
        <App />
      </AppProviders>
    </BrowserRouter>
  </React.StrictMode>,
)
