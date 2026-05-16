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
import {
  fromDatetimeLocalValue,
  meterFormSchema,
  toDatetimeLocalValue,
  type MeterFormValues,
} from '@/lib/meter-schema'
import type { Meter } from '@/types/meter'

interface MeterFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  meter?: Meter | null
  onSubmit: (values: MeterFormValues) => void
  isPending: boolean
}

const emptyDefaults: MeterFormValues = {
  meterNumber: '',
  readingValue: 0,
  readingDate: toDatetimeLocalValue(new Date().toISOString()),
}

export function MeterFormDialog({
  open,
  onOpenChange,
  meter,
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
            }
          : emptyDefaults,
      )
    }
  }, [open, meter, reset])

  const handleFormSubmit = handleSubmit((values: MeterFormValues) => {
    onSubmit({
      meterNumber: values.meterNumber,
      readingValue: Number(values.readingValue),
      readingDate: fromDatetimeLocalValue(values.readingDate),
    })
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Okumayı Düzenle' : 'Yeni Okuma'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meterNumber">Sayaç Numarası</Label>
            <Input id="meterNumber" placeholder="örn. SN-1024" {...register('meterNumber')} />
            {errors.meterNumber && (
              <p className="text-sm text-destructive">{errors.meterNumber.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="readingValue">Okuma Değeri (kWh)</Label>
            <Input
              id="readingValue"
              type="number"
              step="0.01"
              min="0"
              {...register('readingValue', { valueAsNumber: true })}
            />
            {errors.readingValue && (
              <p className="text-sm text-destructive">{errors.readingValue.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="readingDate">Okuma Tarihi</Label>
            <Input id="readingDate" type="datetime-local" {...register('readingDate')} />
            {errors.readingDate && (
              <p className="text-sm text-destructive">{errors.readingDate.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              İptal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Kaydediliyor...' : isEdit ? 'Güncelle' : 'Kaydet'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
