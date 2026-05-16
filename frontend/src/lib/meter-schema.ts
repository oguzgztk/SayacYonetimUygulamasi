import { z } from 'zod'

export const meterFormSchema = z.object({
  meterNumber: z.string().min(1, 'Sayaç numarası zorunludur'),
  readingValue: z
    .number({ message: 'Geçerli bir sayı girin' })
    .positive('Okuma değeri pozitif olmalıdır'),
  readingDate: z.string().min(1, 'Tarih zorunludur'),
})

export type MeterFormValues = z.infer<typeof meterFormSchema>

export function toDatetimeLocalValue(iso: string): string {
  const date = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function fromDatetimeLocalValue(value: string): string {
  return new Date(value).toISOString()
}
