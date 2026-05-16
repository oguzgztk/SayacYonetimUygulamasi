import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import {
  fromDatetimeLocalValue,
  meterFormSchema,
  toDatetimeLocalValue,
  type MeterFormValues,
} from '@/lib/meter-schema'
import type { Meter } from '@/types/meter'
import type { CommunicationUnit } from '@/types/communication-unit'

interface MeterFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  meter?: Meter | null
  units: CommunicationUnit[]
  onSubmit: (values: MeterFormValues) => void
  isPending: boolean
}

const emptyDefaults: MeterFormValues = {
  meterNumber: '',
  readingValue: 0,
  readingDate: toDatetimeLocalValue(new Date().toISOString()),
  communicationUnitId: 0,
}

export function MeterFormDialog({
  open,
  onOpenChange,
  meter,
  units,
  onSubmit,
  isPending,
}: MeterFormDialogProps) {
  const isEdit = Boolean(meter)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MeterFormValues>({
    resolver: zodResolver(meterFormSchema),
    defaultValues: emptyDefaults,
  })

  useEffect(() => {
    if (open) {
      reset(
        meter
          ? {
              meterNumber: meter.meterNumber,
              readingValue: meter.readingValue,
              readingDate: toDatetimeLocalValue(meter.readingDate),
              communicationUnitId: meter.communicationUnitId,
            }
          : {
              ...emptyDefaults,
              communicationUnitId: units[0]?.id ?? 0,
            },
      )
    }
  }, [open, meter, units, reset])

  const handleFormSubmit = handleSubmit((values: MeterFormValues) => {
    onSubmit({
      meterNumber: values.meterNumber,
      readingValue: Number(values.readingValue),
      readingDate: fromDatetimeLocalValue(values.readingDate),
      communicationUnitId: Number(values.communicationUnitId),
    })
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Kaydı düzenle' : 'Yeni sayaç kaydı'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meterNumber">Sayaç numarası</Label>
            <Input id="meterNumber" placeholder="örn. M-1042" {...register('meterNumber')} />
            {errors.meterNumber && (
              <p className="text-xs text-destructive">{errors.meterNumber.message}</p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="readingValue">Okuma değeri</Label>
              <Input
                id="readingValue"
                type="number"
                step="0.01"
                min="0"
                {...register('readingValue', { valueAsNumber: true })}
              />
              {errors.readingValue && (
                <p className="text-xs text-destructive">{errors.readingValue.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="readingDate">Okuma tarihi</Label>
              <Input id="readingDate" type="datetime-local" {...register('readingDate')} />
              {errors.readingDate && (
                <p className="text-xs text-destructive">{errors.readingDate.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="communicationUnitId">Haberleşme ünitesi</Label>
            <Select
              id="communicationUnitId"
              {...register('communicationUnitId', { valueAsNumber: true })}
            >
              <option value={0} disabled>
                Ünite seçin
              </option>
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} — {u.ipAddress}:{u.port}
                </option>
              ))}
            </Select>
            {errors.communicationUnitId && (
              <p className="text-xs text-destructive">{errors.communicationUnitId.message}</p>
            )}
            {units.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Önce Haberleşme Üniteleri sayfasından bir ünite ekleyin.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              İptal
            </Button>
            <Button type="submit" disabled={isPending || units.length === 0}>
              {isPending ? 'Kaydediliyor…' : isEdit ? 'Güncelle' : 'Kaydet'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
