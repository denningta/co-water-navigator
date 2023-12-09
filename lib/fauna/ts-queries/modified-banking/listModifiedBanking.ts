import { fql } from "fauna";

export default function getModifiedBanking(permitNumber: string, year: string) {
  return fql`
    let permitNumber = ${permitNumber}
    let year = ${year}

    administrativeReports.firstWhere(.permitNumber == permitNumber && year == year)
  `
}

export function getModifiedBankingRecords(
  permitNumbers: string[] | null,
  years: string[] | null
) {
  if (!permitNumbers && !years) throw new Error('No permitNumbers or years query parameters found')

  return fql`
    let permitNumbers = ${permitNumbers}
    let years = ${years}

    if (permitNumbers != null && years != null) {
      administrativeReports.where(doc => {
        permitNumbers.includes(permitNumber => permitNumber == doc.permitNumber)
        && years.includes(year => year == doc.year)
      })
    } else if (years != null) {
      administrativeReports.where(doc => {
        years.includes(year => year == doc.year)
      })
    } else if (permitNumbers != null) {
      administrativeReports.where(doc => {
        permitNumbers.includes(permitNumber => permitNumber == doc.permitNumber)
      })
    }

  `
}
