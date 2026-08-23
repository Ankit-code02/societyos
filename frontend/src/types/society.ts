export interface Building {
  id: string
  societyId: string
  name: string
  code: string
  floorCount: number
  unitCount: number
  status: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateBuildingRequest {
  name: string
  code: string
  floorCount: number
  unitCount: number
}

export interface Unit {
  id: string
  buildingId: string
  unitNumber: string
  floorNumber: number
  unitType: string
  status: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateUnitRequest {
  unitNumber: string
  floorNumber: number
  unitType: string
  status: string
}

export interface BuildingListResponse {
  buildings: Building[]
}

export interface UnitListResponse {
  units: Unit[]
}