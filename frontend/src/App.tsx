import { useState } from 'react'
import { Header } from '@/components/Header'
import { DashboardStats } from '@/components/DashboardStats'
import { MeterTable } from '@/components/MeterTable'
import { MeterFormDialog } from '@/components/MeterFormDialog'
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog'
import { EmptyState } from '@/components/EmptyState'
import {
  useCreateMeter,
  useDeleteMeter,
  useMeters,
  useUpdateMeter,
} from '@/hooks/useMeters'
import { toast } from '@/hooks/use-toast'
import type { Meter } from '@/types/meter'
import type { MeterFormValues } from '@/lib/meter-schema'
import { Loader2 } from 'lucide-react'

export default function App() {
  const { data: meters = [], isLoading, isError, error } = useMeters()
  const createMutation = useCreateMeter()
  const updateMutation = useUpdateMeter()
  const deleteMutation = useDeleteMeter()

  const [formOpen, setFormOpen] = useState(false)
  const [editingMeter, setEditingMeter] = useState<Meter | null>(null)
  const [deletingMeter, setDeletingMeter] = useState<Meter | null>(null)

  function openCreate() {
    setEditingMeter(null)
    setFormOpen(true)
  }

  function openEdit(meter: Meter) {
    setEditingMeter(meter)
    setFormOpen(true)
  }

  async function handleFormSubmit(values: MeterFormValues) {
    try {
      if (editingMeter) {
        await updateMutation.mutateAsync({
          id: editingMeter.id,
          meterNumber: values.meterNumber,
          readingValue: values.readingValue,
          readingDate: values.readingDate,
        })
        toast({ title: 'Güncellendi', description: 'Okuma başarıyla güncellendi.' })
      } else {
        await createMutation.mutateAsync(values)
        toast({ title: 'Eklendi', description: 'Yeni okuma kaydedildi.' })
      }
      setFormOpen(false)
    } catch {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'İşlem sırasında bir hata oluştu.',
      })
    }
  }

  async function handleDelete() {
    if (!deletingMeter) return
    try {
      await deleteMutation.mutateAsync(deletingMeter.id)
      toast({ title: 'Silindi', description: 'Okuma kaydı silindi.' })
      setDeletingMeter(null)
    } catch {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Silme işlemi başarısız oldu.',
      })
    }
  }

  const formPending = createMutation.isPending || updateMutation.isPending

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Header onAdd={openCreate} />

      {isLoading && (
        <div className="flex items-center justify-center py-24 text-muted-foreground">
          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          Yükleniyor...
        </div>
      )}

      {isError && (
        <div className="mt-8 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          API bağlantısı kurulamadı. Backend&apos;in çalıştığından emin olun.
          {error instanceof Error && (
            <span className="mt-1 block opacity-80">{error.message}</span>
          )}
        </div>
      )}

      {!isLoading && !isError && (
        <div className="mt-8 space-y-8">
          <DashboardStats meters={meters} />
          {meters.length === 0 ? (
            <EmptyState onAdd={openCreate} />
          ) : (
            <MeterTable
              meters={meters}
              onEdit={openEdit}
              onDelete={setDeletingMeter}
            />
          )}
        </div>
      )}

      <MeterFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        meter={editingMeter}
        onSubmit={handleFormSubmit}
        isPending={formPending}
      />

      <DeleteConfirmDialog
        meter={deletingMeter}
        open={Boolean(deletingMeter)}
        onOpenChange={(open) => !open && setDeletingMeter(null)}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  )
}
