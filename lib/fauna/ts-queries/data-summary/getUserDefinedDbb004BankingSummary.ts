import { fql } from "fauna";

export default function getUserDefinedDbb004BankingSummary(permitNumber: string, year: string) {
  return fql`
    let permitNumber = ${permitNumber}
    let year = ${year}

    modifiedBankingSummary.firstWhere(.permitNumber == permitNumber && .year == year)
  `
}
