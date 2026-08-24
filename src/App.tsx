import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { VariantProvider } from '@/lib/variant'
import { GuidedShowcaseProvider } from '@/components/prototype/GuidedShowcase'
import { AppLayout } from '@/components/layout/AppLayout'
import Dashboard from '@/pages/Dashboard'
import Prospects from '@/pages/Prospects'
import Home from '@/pages/Home'

export default function App() {
  return (
    <VariantProvider>
    <GuidedShowcaseProvider>
    <Routes>
      <Route
        element={
          <AppLayout>
            <Outlet />
          </AppLayout>
        }
      >
        <Route path="/clinical/prospects" element={<Prospects />} />
        <Route path="/crm/dashboard" element={<Dashboard />} />
      </Route>
      <Route path="/theme" element={<Home />} />
      <Route path="/" element={<Navigate to="/clinical/prospects" replace />} />
      <Route path="*" element={<Navigate to="/clinical/prospects" replace />} />
    </Routes>
    </GuidedShowcaseProvider>
    </VariantProvider>
  )
}
