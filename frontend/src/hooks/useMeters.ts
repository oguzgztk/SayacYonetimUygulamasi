import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createMeter,
  fetchDeletedMeters,
  fetchMeters,
  restoreMeter,
  softDeleteMeter,
  updateMeter,
} from '@/lib/api'
import type { MeterCreateDto } from '@/types/meter'

export const metersQueryKey = ['meters'] as const
export const deletedMetersQueryKey = ['meters', 'deleted'] as const

export function useMeters() {
  return useQuery({
    queryKey: metersQueryKey,
    queryFn: fetchMeters,
  })
}

export function useDeletedMeters(enabled: boolean) {
  return useQuery({
    queryKey: deletedMetersQueryKey,
    queryFn: fetchDeletedMeters,
    enabled,
  })
}

export function useCreateMeter() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: MeterCreateDto) => createMeter(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: metersQueryKey })
      queryClient.invalidateQueries({ queryKey: ['communicationUnits'] })
    },
  })
}

export function useUpdateMeter() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: MeterCreateDto }) => updateMeter(id, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: metersQueryKey }),
  })
}

export function useSoftDeleteMeter() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: softDeleteMeter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: metersQueryKey })
      queryClient.invalidateQueries({ queryKey: deletedMetersQueryKey })
    },
  })
}

export function useRestoreMeter() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: restoreMeter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: metersQueryKey })
      queryClient.invalidateQueries({ queryKey: deletedMetersQueryKey })
    },
  })
}
