import { Gauge, Radio, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type AppPage = 'meters' | 'units'

interface AppShellProps {
  page: AppPage
  onPageChange: (page: AppPage) => void
  children: React.ReactNode
}

const nav: { id: AppPage; label: string; icon: LucideIcon }[] = [
  { id: 'meters', label: 'Sayaçlar', icon: Gauge },
  { id: 'units', label: 'Haberleşme Üniteleri', icon: Radio },
]

export function AppShell({ page, onPageChange, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen">
      <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-surface">
        <div className="border-b border-border px-5 py-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Sayaç Yönetim
          </p>
          <h1 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
            Operasyon Paneli
          </h1>
        </div>
        <nav className="flex flex-col gap-0.5 p-3">
          {nav.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onPageChange(item.id)}
              className={cn(
                'flex items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors',
                page === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto border-t border-border px-5 py-4">
          <p className="text-xs text-muted-foreground">Yerel geliştirme ortamı</p>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-6 py-8 md:px-10 md:py-10">{children}</div>
      </main>
    </div>
  )
}
