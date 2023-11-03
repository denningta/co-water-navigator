import { fql } from "fauna";
import { ModifiedBanking } from "../../../../interfaces/ModifiedBanking";

export default function upsertModifiedBanking(data: ModifiedBanking) {
  const { permitNumber, year } = data
  if (!permitNumber) throw new Error('No permitNumber defined')
  if (!year) throw new Error('No year defined')

  return fql`
    let data = ${data as any}
    let permitNumber = ${permitNumber}
    let year = ${year}
    
    let document = administrativeReports.firstWhere(.permitNumber == permitNumber && .year == year)

    if (document != null) {
      document.update(data)
    } else {
      administrativeReports.create(data)
    }
  `
}
