import type { Meter } from '@/types/meter'

/**
 * Her sayaç ID'si için önceki okumaya göre fark (Δ kWh) döner.
 * Aynı sayaç numarasının en eski okuması null, sonrakiler pozitif/negatif sayı.
 */
export function buildDeltaMap(meters: Meter[]): Map<number, number | null> {
  const byNumber = new Map<string, Meter[]>()
  for (const m of meters) {
    const arr = byNumber.get(m.meterNumber) ?? []
    arr.push(m)
    byNumber.set(m.meterNumber, arr)
  }

  const result = new Map<number, number | null>()
  for (const arr of byNumber.values()) {
    arr.sort((a, b) => new Date(a.readingDate).getTime() - new Date(b.readingDate).getTime())
    arr.forEach((m, i) => {
      result.set(m.id, i === 0 ? null : m.readingValue - arr[i - 1].readingValue)
    })
  }
  return result
}
