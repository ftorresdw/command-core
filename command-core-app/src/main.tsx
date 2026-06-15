import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''

function AppProviders(props: { children: React.ReactNode }) {
  if (!googleClientId) {
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
