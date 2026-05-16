import { ArrowDown, ArrowUp, Pencil, Search, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatReadingDate, formatReadingValue } from '@/lib/format'
import type { Meter } from '@/types/meter'

type SortKey = 'meterNumber' | 'readingValue' | 'readingDate'
type SortDir = 'asc' | 'desc'

interface MeterTableProps {
  meters: Meter[]
  onEdit: (meter: Meter) => void
  onDelete: (meter: Meter) => void
}

export function MeterTable({ meters, onEdit, onDelete }: MeterTableProps) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('readingDate')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = q
      ? meters.filter((m) => m.meterNumber.toLowerCase().includes(q))
      : [...meters]

    list.sort((a, b) => {
      let cmp = 0
      if (sortKey === 'meterNumber') {
        cmp = a.meterNumber.localeCompare(b.meterNumber, 'tr')
      } else if (sortKey === 'readingValue') {
        cmp = a.readingValue - b.readingValue
      } else {
        cmp = new Date(a.readingDate).getTime() - new Date(b.readingDate).getTime()
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
    return list
  }, [meters, search, sortKey, sortDir])

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  function SortIcon({ column }: { column: SortKey }) {
    if (sortKey !== column) return null
    return sortDir === 'asc' ? (
      <ArrowUp className="ml-1 inline h-3 w-3" />
    ) : (
      <ArrowDown className="ml-1 inline h-3 w-3" />
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>Okuma Kayıtları</CardTitle>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Sayaç no ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent>
        {/* Desktop table */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">#</TableHead>
                <TableHead>
                  <button type="button" onClick={() => toggleSort('meterNumber')} className="hover:text-foreground">
                    Sayaç No <SortIcon column="meterNumber" />
                  </button>
                </TableHead>
                <TableHead>
                  <button type="button" onClick={() => toggleSort('readingValue')} className="hover:text-foreground">
                    Değer (kWh) <SortIcon column="readingValue" />
                  </button>
                </TableHead>
                <TableHead>
                  <button type="button" onClick={() => toggleSort('readingDate')} className="hover:text-foreground">
                    Tarih <SortIcon column="readingDate" />
                  </button>
                </TableHead>
                <TableHead className="w-28 text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((meter) => (
                <TableRow key={meter.id}>
                  <TableCell className="text-muted-foreground">{meter.id}</TableCell>
                  <TableCell className="font-medium">{meter.meterNumber}</TableCell>
                  <TableCell className="text-accent">{formatReadingValue(meter.readingValue)}</TableCell>
                  <TableCell>{formatReadingDate(meter.readingDate)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(meter)} aria-label="Düzenle">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(meter)}
                        aria-label="Sil"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile cards */}
        <div className="space-y-3 md:hidden">
          {filtered.map((meter) => (
            <div
              key={meter.id}
              className="rounded-lg border border-border/50 bg-secondary/20 p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{meter.meterNumber}</p>
                  <p className="text-xs text-muted-foreground">#{meter.id}</p>
                </div>
                <p className="text-lg font-bold text-accent">
                  {formatReadingValue(meter.readingValue)} kWh
                </p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {formatReadingDate(meter.readingDate)}
              </p>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(meter)}>
                  <Pencil className="h-3.5 w-3.5" />
                  Düzenle
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-destructive"
                  onClick={() => onDelete(meter)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Sil
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && search && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            &quot;{search}&quot; için sonuç bulunamadı.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
