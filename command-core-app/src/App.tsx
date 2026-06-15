import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell/AppShell'
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute'
import { CrmPage } from './pages/CrmPage/CrmPage'
import { LoginPage } from './pages/LoginPage/LoginPage'
import { TicketsPage } from './pages/TicketsPage/TicketsPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/crm" replace />} />
          <Route path="/crm" element={<CrmPage />} />
          <Route path="/tickets" element={<TicketsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/crm" replace />} />
    </Routes>
  )
}

export default App
