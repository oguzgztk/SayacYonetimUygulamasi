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

export async function fetchMeter(id: number): Promise<Meter> {
  const { data } = await api.get<Meter>(`${sayacPath}/${id}`)
  return data
}

export async function createMeter(dto: MeterCreateDto): Promise<Meter> {
  const { data } = await api.post<Meter>(sayacPath, dto)
  return data
}

export async function updateMeter(meter: Meter): Promise<void> {
  await api.put(`${sayacPath}/${meter.id}`, meter)
}

export async function deleteMeter(id: number): Promise<void> {
  await api.delete(`${sayacPath}/${id}`)
}
