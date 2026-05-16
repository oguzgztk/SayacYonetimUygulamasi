import { useState } from 'react'
import { AppShell, type AppPage } from '@/components/layout/AppShell'
import { MetersPage } from '@/components/meters/MetersPage'
import { UnitsPage } from '@/components/units/UnitsPage'

export default function App() {
  const [page, setPage] = useState<AppPage>('meters')

  return (
    <AppShell page={page} onPageChange={setPage}>
      {page === 'meters' ? <MetersPage /> : <UnitsPage />}
    </AppShell>
  )
}
