import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createMeter,
  deleteMeter,
  fetchMeters,
  updateMeter,
} from '@/lib/api'
import type { Meter, MeterCreateDto } from '@/types/meter'

export const metersQueryKey = ['meters'] as const

export function useMeters() {
  return useQuery({
    queryKey: metersQueryKey,
    queryFn: fetchMeters,
  })
}

export function useCreateMeter() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: MeterCreateDto) => createMeter(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: metersQueryKey }),
  })
}

export function useUpdateMeter() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (meter: Meter) => updateMeter(meter),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: metersQueryKey }),
  })
}

export function useDeleteMeter() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteMeter(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: metersQueryKey }),
  })
}
