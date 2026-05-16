import { z } from 'zod'

export const meterFormSchema = z.object({
  meterNumber: z.string().min(1, 'Sayaç numarası zorunludur'),
  readingValue: z
    .number({ message: 'Geçerli bir sayı girin' })
    .nonnegative('Okuma değeri negatif olamaz'),
  readingDate: z.string().min(1, 'Tarih zorunludur'),
  communicationUnitId: z
    .number({ message: 'Ünite seçin' })
    .int()
    .positive('Haberleşme ünitesi seçin'),
})

export type MeterFormValues = z.infer<typeof meterFormSchema>

export const unitFormSchema = z.object({
  name: z.string().min(1, 'Ad zorunludur'),
  ipAddress: z
    .string()
    .min(1, 'IP adresi zorunludur')
    .regex(
      /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
      'Geçerli bir IPv4 adresi girin',
    ),
  port: z
    .number()
    .int()
    .min(1, 'Port 1–65535 arasında olmalı')
    .max(65535, 'Port 1–65535 arasında olmalı'),
})

export type UnitFormValues = z.infer<typeof unitFormSchema>

export function toDatetimeLocalValue(iso: string): string {
  const date = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function fromDatetimeLocalValue(value: string): string {
  return new Date(value).toISOString()
}

export function toDateInputValue(iso: string): string {
  const date = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}
