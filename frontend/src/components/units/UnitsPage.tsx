import { useState } from 'react'
import { Archive, ChevronRight, Pencil, Plus, RotateCcw, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog'
import { PageHeader } from '@/components/layout/PageHeader'
import { UnitDetail } from '@/components/units/UnitDetail'
import {
  useCommunicationUnits,
  useCreateCommunicationUnit,
  useDeletedCommunicationUnits,
  useRestoreCommunicationUnit,
  useSoftDeleteCommunicationUnit,
  useUpdateCommunicationUnit,
} from '@/hooks/useCommunicationUnits'
import { toast } from '@/hooks/use-toast'
import { unitFormSchema, type UnitFormValues } from '@/lib/meter-schema'
import type { CommunicationUnit } from '@/types/communication-unit'

export function UnitsPage() {
  const [showDeleted, setShowDeleted] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState<CommunicationUnit | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [selected, setSelected] = useState<CommunicationUnit | null>(null)

  const { data: units = [], isLoading, isError } = useCommunicationUnits()
  const { data: deleted = [], isLoading: deletedLoading } =
    useDeletedCommunicationUnits(showDeleted)

  const createMutation = useCreateCommunicationUnit()
  const updateMutation = useUpdateCommunicationUnit()
  const deleteMutation = useSoftDeleteCommunicationUnit()
  const restoreMutation = useRestoreCommunicationUnit()

  const list = showDeleted ? deleted : units

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UnitFormValues>({
    resolver: zodResolver(unitFormSchema),
    defaultValues: { name: '', ipAddress: '', port: 502 },
  })

  function startEdit(unit: CommunicationUnit) {
    setEditingId(unit.id)
    setShowForm(true)
    setSelected(null)
    reset({ name: unit.name, ipAddress: unit.ipAddress, port: unit.port })
  }

  function startCreate() {
    setEditingId(null)
    setShowForm(true)
    setSelected(null)
    reset({ name: '', ipAddress: '', port: 502 })
  }

  function cancelForm() {
    setShowForm(false)
    setEditingId(null)
    reset({ name: '', ipAddress: '', port: 502 })
  }

  function handleRowClick(unit: CommunicationUnit) {
    if (showDeleted) return
    setSelected((prev) => (prev?.id === unit.id ? null : unit))
    setShowForm(false)
    setEditingId(null)
  }

  const onSubmit = handleSubmit(async (values: UnitFormValues) => {
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, dto: values })
        toast({ title: 'Güncellendi', description: 'Ünite bilgileri kaydedildi.' })
      } else {
        await createMutation.mutateAsync(values)
        toast({ title: 'Eklendi', description: 'Yeni haberleşme ünitesi oluşturuldu.' })
      }
      cancelForm()
    } catch {
      toast({ variant: 'destructive', title: 'Hata', description: 'Kayıt işlemi başarısız.' })
    }
  })

  async function handleDelete() {
    if (!deleting) return
    try {
      await deleteMutation.mutateAsync(deleting.id)
      toast({ title: 'Arşivlendi', description: 'Ünite silinenlere taşındı.' })
      if (selected?.id === deleting.id) setSelected(null)
      setDeleting(null)
    } catch {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Üniteye bağlı sayaç varsa silinemeyebilir.',
      })
    }
  }

  async function handleRestore(unit: CommunicationUnit) {
    try {
      await restoreMutation.mutateAsync(unit.id)
      toast({ title: 'Geri yüklendi', description: 'Ünite tekrar aktif.' })
    } catch {
      toast({ variant: 'destructive', title: 'Hata', description: 'Geri yükleme başarısız.' })
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Haberleşme üniteleri"
        description="RTU ve saha modemlerinin ağ adreslerini tanımlayın; ünite satırına tıklayarak bağlı sayaçları görün."
        actions={
          !showDeleted &&
          !showForm && (
            <Button onClick={startCreate}>
              <Plus className="h-4 w-4" />
              Yeni ünite
            </Button>
          )
        }
      />

      {showForm && !showDeleted && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Üniteyi düzenle' : 'Yeni ünite'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="grid max-w-xl gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name">Ad</Label>
                <Input id="name" placeholder="örn. Merkez RTU" {...register('name')} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="ipAddress">IP adresi</Label>
                <Input id="ipAddress" placeholder="192.168.1.10" {...register('ipAddress')} />
                {errors.ipAddress && (
                  <p className="text-xs text-destructive">{errors.ipAddress.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="port">Port</Label>
                <Input id="port" type="number" {...register('port', { valueAsNumber: true })} />
                {errors.port && <p className="text-xs text-destructive">{errors.port.message}</p>}
              </div>
              <div className="flex gap-2 sm:col-span-2">
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingId ? 'Güncelle' : 'Kaydet'}
                </Button>
                <Button type="button" variant="secondary" onClick={cancelForm}>
                  İptal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-surface/80">
          <div>
            <CardTitle className="text-sm font-semibold">
              {showDeleted ? 'Silinen üniteler' : 'Ünite listesi'}
            </CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">{list.length} kayıt</p>
          </div>
          <Button
            variant={showDeleted ? 'default' : 'secondary'}
            size="sm"
            onClick={() => {
              setShowDeleted((v) => !v)
              setShowForm(false)
              setSelected(null)
            }}
          >
            <Archive className="h-3.5 w-3.5" />
            {showDeleted ? 'Aktif liste' : 'Silinenler'}
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {isError && (
            <p className="px-5 py-8 text-center text-sm text-destructive">API bağlantı hatası.</p>
          )}
          {(isLoading || (showDeleted && deletedLoading)) && (
            <p className="px-5 py-12 text-center text-sm text-muted-foreground">Yükleniyor…</p>
          )}
          {!isLoading && list.length === 0 && (
            <p className="px-5 py-12 text-center text-sm text-muted-foreground">Kayıt yok.</p>
          )}
          {list.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground w-5" />
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Ad
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Adres
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Sayaç
                  </TableHead>
                  <TableHead className="w-20" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((u, i) => {
                  const isSelected = selected?.id === u.id
                  return (
                    <TableRow
                      key={u.id}
                      className={[
                        i % 2 === 1 ? 'bg-surface/60' : '',
                        !showDeleted ? 'cursor-pointer' : '',
                        isSelected ? '!bg-primary/5' : '',
                      ].join(' ')}
                      onClick={() => handleRowClick(u)}
                    >
                      <TableCell className="pr-0 w-5">
                        {!showDeleted && (
                          <ChevronRight
                            className={[
                              'h-3.5 w-3.5 text-muted-foreground transition-transform',
                              isSelected ? 'rotate-90' : '',
                            ].join(' ')}
                          />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {u.ipAddress}:{u.port}
                      </TableCell>
                      <TableCell className="tabular-nums">{u.meterCount}</TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        {showDeleted ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRestore(u)}
                            aria-label="Geri yükle"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        ) : (
                          <div className="flex justify-end gap-0.5">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => startEdit(u)}
                              aria-label="Düzenle"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => setDeleting(u)}
                              aria-label="Sil"
                            >
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

      {selected && !showDeleted && (
        <UnitDetail unit={selected} onClose={() => setSelected(null)} />
      )}

      <DeleteConfirmDialog
        open={Boolean(deleting)}
        title="Üniteyi arşivle"
        description={
          deleting
            ? `"${deleting.name}" ünitesini silinenlere taşımak istiyor musunuz? Bağlı sayaç varsa işlem reddedilebilir.`
            : ''
        }
        confirmLabel="Arşivle"
        onOpenChange={(open) => !open && setDeleting(null)}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  )
}
