import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createCommunicationUnit,
  fetchCommunicationUnits,
  fetchDeletedCommunicationUnits,
  restoreCommunicationUnit,
  softDeleteCommunicationUnit,
  updateCommunicationUnit,
} from '@/lib/communication-unit-api'
import type { CommunicationUnitCreateDto } from '@/types/communication-unit'

export const unitsQueryKey = ['communicationUnits'] as const
export const deletedUnitsQueryKey = ['communicationUnits', 'deleted'] as const

export function useCommunicationUnits() {
  return useQuery({
    queryKey: unitsQueryKey,
    queryFn: fetchCommunicationUnits,
  })
}

export function useDeletedCommunicationUnits(enabled: boolean) {
  return useQuery({
    queryKey: deletedUnitsQueryKey,
    queryFn: fetchDeletedCommunicationUnits,
    enabled,
  })
}

export function useCreateCommunicationUnit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CommunicationUnitCreateDto) => createCommunicationUnit(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: unitsQueryKey }),
  })
}

export function useUpdateCommunicationUnit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: CommunicationUnitCreateDto }) =>
      updateCommunicationUnit(id, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: unitsQueryKey }),
  })
}

export function useSoftDeleteCommunicationUnit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: softDeleteCommunicationUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unitsQueryKey })
      queryClient.invalidateQueries({ queryKey: deletedUnitsQueryKey })
    },
  })
}

export function useRestoreCommunicationUnit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: restoreCommunicationUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unitsQueryKey })
      queryClient.invalidateQueries({ queryKey: deletedUnitsQueryKey })
    },
  })
}
