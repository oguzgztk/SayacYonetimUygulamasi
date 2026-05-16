import { useMemo, useState } from 'react'
import {
  Archive,
  ArrowDown,
  ArrowUp,
  Download,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatCard } from '@/components/layout/StatCard'
import { MonthlyChart } from '@/components/meters/MonthlyChart'
import { MeterFormDialog } from '@/components/meters/MeterFormDialog'
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog'
import {
  useCreateMeter,
  useDeletedMeters,
  useMeters,
  useRestoreMeter,
  useSoftDeleteMeter,
  useUpdateMeter,
} from '@/hooks/useMeters'
import { useCommunicationUnits } from '@/hooks/useCommunicationUnits'
import { toast } from '@/hooks/use-toast'
import { exportMetersToCsv } from '@/lib/export-csv'
import { buildDeltaMap } from '@/lib/delta'
import { formatReadingDate, formatReadingValue } from '@/lib/format'
import type { MeterFormValues } from '@/lib/meter-schema'
import type { Meter } from '@/types/meter'

type SortKey = 'meterNumber' | 'readingValue' | 'readingDate'

export function MetersPage() {
  const [showDeleted, setShowDeleted] = useState(false)
  const [search, setSearch] = useState('')
  const [unitFilter, setUnitFilter] = useState<string>('all')
  const [sortKey, setSortKey] = useState<SortKey>('readingDate')
  const [sortAsc, setSortAsc] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Meter | null>(null)
  const [deleting, setDeleting] = useState<Meter | null>(null)

  const { data: meters = [], isLoading, isError } = useMeters()
  const { data: deleted = [], isLoading: deletedLoading } = useDeletedMeters(showDeleted)
  const { data: units = [] } = useCommunicationUnits()

  const createMutation = useCreateMeter()
  const updateMutation = useUpdateMeter()
  const deleteMutation = useSoftDeleteMeter()
  const restoreMutation = useRestoreMeter()

  const deltaMap = useMemo(() => buildDeltaMap(meters), [meters])

  const list = showDeleted ? deleted : meters

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let items = [...list]

    if (unitFilter !== 'all') {
      const uid = Number(unitFilter)
      items = items.filter((m) => m.communicationUnitId === uid)
    }
    if (q) {
      items = items.filter(
        (m) =>
          m.meterNumber.toLowerCase().includes(q) ||
          m.communicationUnitName.toLowerCase().includes(q),
      )
    }

    items.sort((a, b) => {
      let cmp = 0
      if (sortKey === 'meterNumber') cmp = a.meterNumber.localeCompare(b.meterNumber, 'tr')
      else if (sortKey === 'readingValue') cmp = a.readingValue - b.readingValue
      else cmp = new Date(a.readingDate).getTime() - new Date(b.readingDate).getTime()
      return sortAsc ? cmp : -cmp
    })
    return items
  }, [list, search, unitFilter, sortKey, sortAsc])

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((v) => !v)
    else { setSortKey(key); setSortAsc(true) }
  }

  function SortIcon({ column }: { column: SortKey }) {
    if (sortKey !== column) return null
    return sortAsc
      ? <ArrowUp className="ml-1 inline h-3 w-3 opacity-60" />
      : <ArrowDown className="ml-1 inline h-3 w-3 opacity-60" />
  }

  async function handleSubmit(values: MeterFormValues) {
    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, dto: values })
        toast({ title: 'Güncellendi', description: 'Sayaç kaydı güncellendi.' })
      } else {
        await createMutation.mutateAsync(values)
        toast({ title: 'Eklendi', description: 'Yeni sayaç kaydı oluşturuldu.' })
      }
      setFormOpen(false)
      setEditing(null)
    } catch {
      toast({ variant: 'destructive', title: 'Hata', description: 'Kayıt işlemi başarısız.' })
    }
  }

  async function handleDelete() {
    if (!deleting) return
    try {
      await deleteMutation.mutateAsync(deleting.id)
      toast({ title: 'Arşivlendi', description: 'Kayıt silinenlere taşındı.' })
      setDeleting(null)
    } catch {
      toast({ variant: 'destructive', title: 'Hata', description: 'Silme işlemi başarısız.' })
    }
  }

  async function handleRestore(meter: Meter) {
    try {
      await restoreMutation.mutateAsync(meter.id)
      toast({ title: 'Geri yüklendi', description: 'Kayıt tekrar aktif.' })
    } catch {
      toast({ variant: 'destructive', title: 'Hata', description: 'Geri yükleme başarısız.' })
    }
  }

  const stats = useMemo(() => {
    const now = new Date()
    const monthCount = meters.filter((m) => {
      const d = new Date(m.readingDate)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length
    const latest = meters.length
      ? [...meters].sort(
          (a, b) => new Date(b.readingDate).getTime() - new Date(a.readingDate).getTime(),
        )[0]
      : null
    const totalKwh = meters.reduce((s, m) => s + m.readingValue, 0)
    return { total: meters.length, monthCount, latest, totalKwh }
  }, [meters])

  return (
    <div className="space-y-8">
      <PageHeader
        title="Sayaç okumaları"
        description="Saha okumalarını ünite bazında izleyin, arşivleyin veya dışa aktarın."
        actions={
          !showDeleted && (
            <>
              <Button
                variant="secondary"
                size="sm"
                disabled={filtered.length === 0}
                onClick={() => exportMetersToCsv(filtered)}
              >
                <Download className="h-4 w-4" />
                CSV
              </Button>
              <Button onClick={() => { setEditing(null); setFormOpen(true) }}>
                <Plus className="h-4 w-4" />
                Yeni kayıt
              </Button>
            </>
          )
        }
      />

      {!showDeleted && (
        <div className="grid gap-5 lg:grid-cols-[1fr_1fr_1fr_1.8fr]">
          <StatCard label="Aktif kayıt" value={String(stats.total)} />
          <StatCard label="Bu ay" value={String(stats.monthCount)} hint="okuma sayısı" />
          <StatCard
            label="Toplam endeks"
            value={formatReadingValue(stats.totalKwh)}
            hint="tüm aktif kayıtlar"
          />
          <div className="rounded-lg border border-border bg-surface-elevated px-4 py-3.5 border-l-[3px] border-l-primary">
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground mb-2">
              Son 6 ay — okuma sayısı
            </p>
            <MonthlyChart meters={meters} />
          </div>
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-col gap-3 border-b border-border bg-surface/80 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-sm font-semibold">
              {showDeleted ? 'Silinen kayıtlar' : 'Kayıt listesi'}
            </CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">{filtered.length} kayıt gösteriliyor</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {!showDeleted && units.length > 0 && (
              <Select
                value={unitFilter}
                onChange={(e) => setUnitFilter(e.target.value)}
                className="w-[11rem] text-sm"
                aria-label="Ünite filtresi"
              >
                <option value="all">Tüm üniteler</option>
                {units.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </Select>
            )}
            <div className="relative min-w-[11rem] flex-1 sm:max-w-[14rem]">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Ara…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button
              variant={showDeleted ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setShowDeleted((v) => !v)}
            >
              <Archive className="h-3.5 w-3.5" />
              {showDeleted ? 'Aktif' : 'Silinenler'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isError && (
            <p className="px-5 py-10 text-center text-sm text-destructive">
              API bağlantısı kurulamadı. Backend çalışıyor mu?
            </p>
          )}
          {(isLoading || (showDeleted && deletedLoading)) && (
            <p className="px-5 py-14 text-center text-sm text-muted-foreground">Yükleniyor…</p>
          )}
          {!isLoading && !isError && filtered.length === 0 && (
            <p className="px-5 py-14 text-center text-sm text-muted-foreground">
              {showDeleted ? 'Silinen kayıt yok.' : 'Kayıt bulunamadı.'}
            </p>
          )}
          {filtered.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>
                    <button type="button" onClick={() => toggleSort('meterNumber')}
                      className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Sayaç <SortIcon column="meterNumber" />
                    </button>
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Ünite
                  </TableHead>
                  <TableHead>
                    <button type="button" onClick={() => toggleSort('readingValue')}
                      className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      kWh <SortIcon column="readingValue" />
                    </button>
                  </TableHead>
                  {!showDeleted && (
                    <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Δ kWh
                    </TableHead>
                  )}
                  <TableHead>
                    <button type="button" onClick={() => toggleSort('readingDate')}
                      className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Tarih <SortIcon column="readingDate" />
                    </button>
                  </TableHead>
                  <TableHead className="w-20" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((m, i) => {
                  const delta = deltaMap.get(m.id)
                  return (
                    <TableRow key={m.id} className={i % 2 === 1 ? 'bg-surface/60' : undefined}>
                      <TableCell className="font-mono text-sm font-medium">{m.meterNumber}</TableCell>
                      <TableCell>
                        <Badge variant="unit" className="mb-1">{m.communicationUnitName}</Badge>
                        <span className="block font-mono text-[11px] text-muted-foreground">
                          {m.communicationUnitIp}:{m.communicationUnitPort}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-sm tabular-nums">
                        {formatReadingValue(m.readingValue)}
                      </TableCell>
                      {!showDeleted && (
                        <TableCell className="font-mono text-sm tabular-nums">
                          {delta === null || delta === undefined ? (
                            <span className="text-muted-foreground">—</span>
                          ) : (
                            <span className={delta >= 0 ? 'text-[#2a6049]' : 'text-destructive'}>
                              {delta >= 0 ? '+' : ''}
                              {formatReadingValue(delta)}
                            </span>
                          )}
                        </TableCell>
                      )}
                      <TableCell className="text-sm text-muted-foreground">
                        {formatReadingDate(m.readingDate)}
                      </TableCell>
                      <TableCell className="text-right">
                        {showDeleted ? (
                          <Button variant="ghost" size="icon" onClick={() => handleRestore(m)} aria-label="Geri yükle">
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        ) : (
                          <div className="flex justify-end gap-0.5">
                            <Button variant="ghost" size="icon"
                              onClick={() => { setEditing(m); setFormOpen(true) }} aria-label="Düzenle">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setDeleting(m)} aria-label="Sil">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <MeterFormDialog
        open={formOpen}
        onOpenChange={(open) => { setFormOpen(open); if (!open) setEditing(null) }}
        meter={editing}
        units={units}
        onSubmit={handleSubmit}
        isPending={createMutation.isPending || updateMutation.isPending}
      />
      <DeleteConfirmDialog
        open={Boolean(deleting)}
        title="Kaydı arşivle"
        description={deleting ? `"${deleting.meterNumber}" kaydını silinenlere taşımak istiyor musunuz?` : ''}
        onOpenChange={(open) => !open && setDeleting(null)}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
        confirmLabel="Arşivle"
      />
    </div>
  )
}
