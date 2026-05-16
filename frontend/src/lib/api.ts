import axios from 'axios'
import type { Meter, MeterCreateDto } from '@/types/meter'

const baseURL = import.meta.env.VITE_API_URL ?? ''

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

const sayacPath = '/api/sayac'

export async function fetchMeters(): Promise<Meter[]> {
  const { data } = await api.get<Meter[]>(sayacPath)
  return data
}

export async function fetchDeletedMeters(): Promise<Meter[]> {
  const { data } = await api.get<Meter[]>(`${sayacPath}/deleted`)
  return data
}

export async function createMeter(dto: MeterCreateDto): Promise<Meter> {
  const { data } = await api.post<Meter>(sayacPath, dto)
  return data
}

export async function updateMeter(id: number, dto: MeterCreateDto): Promise<void> {
  await api.put(`${sayacPath}/${id}`, dto)
}

export async function softDeleteMeter(id: number): Promise<void> {
  await api.delete(`${sayacPath}/${id}`)
}

export async function restoreMeter(id: number): Promise<void> {
  await api.post(`${sayacPath}/${id}/restore`)
}
