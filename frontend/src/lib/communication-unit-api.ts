import { api } from '@/lib/api'
import type {
  CommunicationUnit,
  CommunicationUnitCreateDto,
} from '@/types/communication-unit'

const path = '/api/communicationunit'

export async function fetchCommunicationUnits(): Promise<CommunicationUnit[]> {
  const { data } = await api.get<CommunicationUnit[]>(path)
  return data
}

export async function fetchDeletedCommunicationUnits(): Promise<CommunicationUnit[]> {
  const { data } = await api.get<CommunicationUnit[]>(`${path}/deleted`)
  return data
}

export async function createCommunicationUnit(
  dto: CommunicationUnitCreateDto,
): Promise<CommunicationUnit> {
  const { data } = await api.post<CommunicationUnit>(path, dto)
  return data
}

export async function updateCommunicationUnit(
  id: number,
  dto: CommunicationUnitCreateDto,
): Promise<void> {
  await api.put(`${path}/${id}`, dto)
}

export async function softDeleteCommunicationUnit(id: number): Promise<void> {
  await api.delete(`${path}/${id}`)
}

export async function restoreCommunicationUnit(id: number): Promise<void> {
  await api.post(`${path}/${id}/restore`)
}
