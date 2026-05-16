import type { Meter } from '@/types/meter'
import { formatReadingDate, formatReadingValue } from '@/lib/format'

export function exportMetersToCsv(meters: Meter[], filename = 'sayac-okumalari.csv') {
  const header = ['Sayaç No', 'Değer (kWh)', 'Tarih', 'Ünite', 'IP', 'Port']
  const rows = meters.map((m) => [
    m.meterNumber,
    formatReadingValue(m.readingValue),
    formatReadingDate(m.readingDate),
    m.communicationUnitName,
    m.communicationUnitIp,
    String(m.communicationUnitPort),
  ])

  const escape = (cell: string) => `"${cell.replace(/"/g, '""')}"`
  const csv = [header, ...rows].map((row) => row.map(escape).join(';')).join('\n')

  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
