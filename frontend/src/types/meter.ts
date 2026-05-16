export interface Meter {
  id: number
  meterNumber: string
  readingValue: number
  readingDate: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string | null
  communicationUnitId: number
  communicationUnitName: string
  communicationUnitIp: string
  communicationUnitPort: number
}

export interface MeterCreateDto {
  meterNumber: string
  readingValue: number
  readingDate: string
  communicationUnitId: number
}
