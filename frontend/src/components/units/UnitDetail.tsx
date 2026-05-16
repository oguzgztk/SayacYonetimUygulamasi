import { X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useMeters } from '@/hooks/useMeters'
import { formatReadingDate, formatReadingValue } from '@/lib/format'
import type { CommunicationUnit } from '@/types/communication-unit'

interface UnitDetailProps {
  unit: CommunicationUnit
  onClose: () => void
}

export function UnitDetail({ unit, onClose }: UnitDetailProps) {
  const { data: meters = [], isLoading } = useMeters()
  const unitMeters = meters
    .filter((m) => m.communicationUnitId === unit.id)
    .sort((a, b) => new Date(b.readingDate).getTime() - new Date(a.readingDate).getTime())

  return (
    <Card className="border-l-[3px] border-l-primary">
      <CardHeader className="flex flex-row items-start justify-between border-b border-border bg-surface/80 pb-4">
        <div>
          <CardTitle className="text-sm font-semibold">{unit.name}</CardTitle>
          <p className="mt-0.5 font-mono text-xs text-muted-foreground">
            {unit.ipAddress}:{unit.port}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="unit">{unitMeters.length} sayaç</Badge>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Kapat">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading && (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">Yükleniyor…</p>
        )}
        {!isLoading && unitMeters.length === 0 && (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">
            Bu üniteye bağlı aktif sayaç yok.
          </p>
        )}
        {unitMeters.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Sayaç no
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Değer (kWh)
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Son okuma
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unitMeters.map((m, i) => (
                <TableRow key={m.id} className={i % 2 === 1 ? 'bg-surface/60' : undefined}>
                  <TableCell className="font-mono text-sm font-medium">{m.meterNumber}</TableCell>
                  <TableCell className="font-mono text-sm tabular-nums">
                    {formatReadingValue(m.readingValue)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatReadingDate(m.readingDate)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
