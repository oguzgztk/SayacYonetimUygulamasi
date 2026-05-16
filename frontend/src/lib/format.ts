import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

export function formatReadingDate(iso: string): string {
  return format(new Date(iso), "d MMMM yyyy, HH:mm", { locale: tr })
}

export function formatReadingValue(value: number): string {
  return new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}
