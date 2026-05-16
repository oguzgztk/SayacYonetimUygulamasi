export interface CommunicationUnit {
  id: number
  name: string
  ipAddress: string
  port: number
  isDeleted: boolean
  createdAt: string
  updatedAt: string | null
  meterCount: number
}

export interface CommunicationUnitCreateDto {
  name: string
  ipAddress: string
  port: number
}
