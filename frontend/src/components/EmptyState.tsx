import { Gauge, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  onAdd: () => void
}

export function EmptyState({ onAdd }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/40 px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Gauge className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-semibold">Henüz kayıt yok</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        İlk sayaç okumanızı ekleyerek başlayın.
      </p>
      <Button onClick={onAdd} className="mt-6">
        <Plus className="h-4 w-4" />
        İlk Okumayı Ekle
      </Button>
    </div>
  )
}
