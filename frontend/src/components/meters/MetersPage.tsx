import { useMemo, useState } from 'react'
import { Archive, ArrowDown, ArrowUp, Pencil, Plus, RotateCcw, Search, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import { formatReadingDate, formatReadingValue } from '@/lib/format'
import type { MeterFormValues } from '@/lib/meter-schema'
import type { Meter } from '@/types/meter'

type SortKey = 'meterNumber' | 'readingValue' | 'readingDate'

export function MetersPage() {
  const [showDeleted, setShowDeleted] = useState(false)
  const [search, setSearch] = useState('')
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

  const list = showDeleted ? deleted : meters

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let items = q
      ? list.filter(
          (m) =>
            m.meterNumber.toLowerCase().includes(q) ||
            m.communicationUnitName.toLowerCase().includes(q),
        )
      : [...list]

    items.sort((a, b) => {
      let cmp = 0
      if (sortKey === 'meterNumber') cmp = a.meterNumber.localeCompare(b.meterNumber, 'tr')
      else if (sortKey === 'readingValue') cmp = a.readingValue - b.readingValue
      else cmp = new Date(a.readingDate).getTime() - new Date(b.readingDate).getTime()
      return sortAsc ? cmp : -cmp
    })
    return items
  }, [list, search, sortKey, sortAsc])

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((v) => !v)
    else {
      setSortKey(key)
      setSortAsc(true)
    }
  }

  function SortIcon({ column }: { column: SortKey }) {
    if (sortKey !== column) return null
    return sortAsc ? (
      <ArrowUp className="ml-1 inline h-3 w-3" />
    ) : (
      <ArrowDown className="ml-1 inline h-3 w-3" />
    )
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
    return { total: meters.length, monthCount, latest }
  }, [meters])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Sayaç Okumaları</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Okuma kayıtlarını yönetin ve haberleşme ünitelerine bağlayın.
          </p>
        </div>
        {!showDeleted && (
          <Button
            onClick={() => {
              setEditing(null)
              setFormOpen(true)
            }}
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Yeni kayıt
          </Button>
        )}
      </div>

      {!showDeleted && (
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Aktif kayıt', value: String(stats.total) },
            { label: 'Bu ay okuma', value: String(stats.monthCount) },
            {
              label: 'Son okuma',
              value: stats.latest ? formatReadingDate(stats.latest.readingDate) : '—',
              small: true,
            },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="pt-5">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {s.label}
                </p>
                <p className={`mt-1 font-semibold ${s.small ? 'text-base' : 'text-2xl tabular-nums'}`}>
                  {s.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>{showDeleted ? 'Silinen kayıtlar' : 'Kayıt listesi'}</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Sayaç veya ünite ara..."
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
              {showDeleted ? 'Aktif liste' : 'Silinenler'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isError && (
            <p className="px-5 py-8 text-center text-sm text-destructive">
              API bağlantısı kurulamadı. Backend çalışıyor mu?
            </p>
          )}
          {(isLoading || (showDeleted && deletedLoading)) && (
            <p className="px-5 py-12 text-center text-sm text-muted-foreground">Yükleniyor…</p>
          )}
          {!isLoading && !isError && filtered.length === 0 && (
            <p className="px-5 py-12 text-center text-sm text-muted-foreground">
              {showDeleted ? 'Silinen kayıt yok.' : 'Henüz kayıt yok.'}
            </p>
          )}
          {filtered.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button type="button" onClick={() => toggleSort('meterNumber')} className="font-medium">
                      Sayaç no <SortIcon column="meterNumber" />
                    </button>
                  </TableHead>
                  <TableHead>Ünite</TableHead>
                  <TableHead>
                    <button type="button" onClick={() => toggleSort('readingValue')} className="font-medium">
                      Değer <SortIcon column="readingValue" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button type="button" onClick={() => toggleSort('readingDate')} className="font-medium">
                      Tarih <SortIcon column="readingDate" />
                    </button>
                  </TableHead>
                  <TableHead className="w-24 text-right">İşlem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.meterNumber}</TableCell>
                    <TableCell>
                      <span className="block text-sm">{m.communicationUnitName}</span>
                      <span className="text-xs text-muted-foreground">
                        {m.communicationUnitIp}:{m.communicationUnitPort}
                      </span>
                    </TableCell>
                    <TableCell className="tabular-nums">{formatReadingValue(m.readingValue)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatReadingDate(m.readingDate)}
                    </TableCell>
                    <TableCell className="text-right">
                      {showDeleted ? (
                        <Button variant="ghost" size="icon" onClick={() => handleRestore(m)} aria-label="Geri yükle">
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      ) : (
                        <div className="flex justify-end gap-0.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditing(m)
                              setFormOpen(true)
                            }}
                            aria-label="Düzenle"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => setDeleting(m)}
                            aria-label="Sil"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <MeterFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) setEditing(null)
        }}
        meter={editing}
        units={units}
        onSubmit={handleSubmit}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteConfirmDialog
        open={Boolean(deleting)}
        title="Kaydı arşivle"
        description={
          deleting
            ? `"${deleting.meterNumber}" kaydını silinenlere taşımak istiyor musunuz?`
            : ''
        }
        onOpenChange={(open) => !open && setDeleting(null)}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
        confirmLabel="Arşivle"
      />
    </div>
  )
}
