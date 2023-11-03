import { fql } from "fauna";

export default function getModifiedBanking(permitNumber: string, year: string) {
  return fql`
    let permitNumber = ${permitNumber}
    let year = ${year}

    administrativeReports.firstWhere(.permitNumber == permitNumber && year == year)
  `
}
