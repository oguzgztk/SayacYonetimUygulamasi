import { useState } from 'react'
import { Archive, Pencil, Plus, RotateCcw, Trash2 } from 'lucide-react'
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
    reset({ name: unit.name, ipAddress: unit.ipAddress, port: unit.port })
  }

  function startCreate() {
    setEditingId(null)
    setShowForm(true)
    reset({ name: '', ipAddress: '', port: 502 })
  }

  function cancelForm() {
    setShowForm(false)
    setEditingId(null)
    reset({ name: '', ipAddress: '', port: 502 })
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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Haberleşme Üniteleri</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Saha cihazlarının bağlandığı ağ uç noktalarını tanımlayın.
          </p>
        </div>
        {!showDeleted && !showForm && (
          <Button onClick={startCreate}>
            <Plus className="h-4 w-4" />
            Yeni ünite
          </Button>
        )}
      </div>

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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{showDeleted ? 'Silinen üniteler' : 'Ünite listesi'}</CardTitle>
          <Button
            variant={showDeleted ? 'default' : 'secondary'}
            size="sm"
            onClick={() => {
              setShowDeleted((v) => !v)
              setShowForm(false)
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
                <TableRow>
                  <TableHead>Ad</TableHead>
                  <TableHead>Adres</TableHead>
                  <TableHead>Sayaç</TableHead>
                  <TableHead className="w-24 text-right">İşlem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {u.ipAddress}:{u.port}
                    </TableCell>
                    <TableCell className="tabular-nums">{u.meterCount}</TableCell>
                    <TableCell className="text-right">
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
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

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
