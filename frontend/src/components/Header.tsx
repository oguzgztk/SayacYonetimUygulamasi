import { Gauge, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  onAdd: () => void
}

export function Header({ onAdd }: HeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-border/40 pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Gauge className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sayaç Yönetim</h1>
          <p className="text-sm text-muted-foreground">Sayaç okumalarını görüntüle ve yönet</p>
        </div>
      </div>
      <Button onClick={onAdd} className="shrink-0">
        <Plus className="h-4 w-4" />
        Yeni Okuma
      </Button>
    </header>
  )
}
