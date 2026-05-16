import { Gauge, Radio, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMeters } from '@/hooks/useMeters'
import { useCommunicationUnits } from '@/hooks/useCommunicationUnits'

export type AppPage = 'meters' | 'units'

interface AppShellProps {
  page: AppPage
  onPageChange: (page: AppPage) => void
  children: React.ReactNode
}

const nav: { id: AppPage; label: string; icon: LucideIcon }[] = [
  { id: 'meters', label: 'Sayaçlar', icon: Gauge },
  { id: 'units', label: 'Haberleşme üniteleri', icon: Radio },
]

export function AppShell({ page, onPageChange, children }: AppShellProps) {
  const { data: meters = [] } = useMeters()
  const { data: units = [] } = useCommunicationUnits()

  const counts: Record<AppPage, number> = {
    meters: meters.length,
    units: units.length,
  }

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-[15.5rem] shrink-0 flex-col border-r border-border bg-surface">
        <div className="px-5 py-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Sayaç yönetim
          </p>
          <h1 className="mt-2 text-[1.05rem] font-semibold leading-snug tracking-tight">
            Operasyon paneli
          </h1>
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {nav.map((item) => {
            const active = page === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onPageChange(item.id)}
                className={cn(
                  'flex items-center justify-between gap-2 rounded-md px-3 py-2.5 text-left text-sm transition-colors',
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <span className="flex items-center gap-2.5 font-medium">
                  <item.icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                  {item.label}
                </span>
                <span
                  className={cn(
                    'min-w-[1.25rem] rounded px-1.5 py-0.5 text-center text-[11px] tabular-nums',
                    active ? 'bg-primary-foreground/15' : 'bg-muted text-muted-foreground',
                  )}
                >
                  {counts[item.id]}
                </span>
              </button>
            )
          })}
        </nav>
        <div className="mt-auto border-t border-border px-5 py-4">
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Okuma kayıtları ve saha üniteleri tek panelde.
          </p>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-background">
        <div className="mx-auto max-w-5xl px-6 py-8 md:px-10 md:py-10">{children}</div>
      </main>
    </div>
  )
}
