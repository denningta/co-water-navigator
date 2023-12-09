import { fql } from "fauna";

export default function getWellUsageQuery(permitNumber: string, year: string) {
  return fql`
    let permitNumber = ${permitNumber}
    let year = ${year}

    wellUsage.firstWhere(.permitNumber == permitNumber && .year == year)
  `
}
