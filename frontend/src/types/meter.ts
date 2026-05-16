export interface Meter {
  id: number
  meterNumber: string
  readingValue: number
  readingDate: string
}

export interface MeterCreateDto {
  meterNumber: string
  readingValue: number
  readingDate: string
}
