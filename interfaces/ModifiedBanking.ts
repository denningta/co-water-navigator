import { CalculatedValue } from "./MeterReading"

export interface ModifiedBanking {
  permitNumber?: string,
  year?: string,
  allowedAppropriation?: CalculatedValue
  bankingReserveLastYear?: CalculatedValue
  bankingReserveThisYear?: CalculatedValue
  changeInBankingReserveThisYear?: CalculatedValue
  dateTimeCreated?: string
  line10?: CalculatedValue
  line3?: CalculatedValue
  line6Option?: 'a' | 'b'
  maxBankingReserve?: CalculatedValue
  originalAppropriation?: CalculatedValue
  pumpingLimitNextYear?: CalculatedValue
  pumpingLimitThisYear?: CalculatedValue
  totalPumpedThisYear?: CalculatedValue
  wellUsageData?: WellUsage
}

export interface WellUsage {
  permitNumber?: string
  year?: string
  changeOfUse?: boolean
  commingledWells?: boolean
  comments?: string
  dateTimeUpdated?: string
  expandedAcres?: boolean,
  other?: boolean
}

export interface ModifiedBankingSummary {
  permitNumber: string
  year: string
  updatedBy?: {
    name?: string | null | undefined
    user_id?: string | null | undefined
  }
  bankingData: ModifiedBankingSummaryRow[]
}

export interface ModifiedBankingSummaryRow {
  name: 'allowedAppropriation' | 'pumpingLimitThisYear' | 'flowMeterLimit'
  value?: CalculatedValue | undefined
  description?: string
}

export interface ModifiedBankingDependencies {
  dataLastYear: ModifiedBanking
  bankingReserveLastYear: CalculatedValue,
  totalPumpedThisYear: CalculatedValue
}

export type ModifiedBankingCalculatedFields = 'allowedAppropriation' | 'bankingReserveLastYear' | 'bankingReserveThisYear' | 'changeInBankingReserveThisYear' | 'line10' | 'line3' | 'maxBankingReserve' | 'originalAppropriation' | 'pumpingLimitNextYear' | 'pumpingLimitThisYear' | 'totalPumpedThisYear' 
