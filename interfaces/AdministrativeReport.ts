import { CalculatedValue } from "./MeterReading"

export interface AdministrativeReport {
  permitNumber: string,
  year: string,
  allowedAppropriation: CalculatedValue
  bankingReserveLastYear: CalculatedValue
  bankingReserveThisYear: CalculatedValue
  changeInBankingReserveThisYear: CalculatedValue
  dateTimeCreated: string
  line10: CalculatedValue
  line3: CalculatedValue
  line6Option: CalculatedValue
  maxBankingReserve: CalculatedValue
  originalAppropriation: CalculatedValue
  pumpingLimitNextYear: CalculatedValue
  pumpingLimitThisYear: CalculatedValue
  totalPumpedThisYear: CalculatedValue
  wellUsageData: {
    changeOfUse: boolean
    comingledWells: boolean
    comment: string
    dateTimeUpdated: string
    expandedAcres: boolean,
    other: boolean
  }
}