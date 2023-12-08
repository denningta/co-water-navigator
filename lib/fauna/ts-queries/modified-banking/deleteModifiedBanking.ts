import { fql } from "fauna";
import { ModifiedBanking } from "../../../../interfaces/ModifiedBanking";

export default function deleteModifiedBanking(id: string) {
  return fql`
    administrativeReports.byId(${id})!.delete()
  `
}

export function deleteModifiedBankingByRecords(records: ModifiedBanking[]) {
  records.forEach(record => {
    if (!record.permitNumber || !record.year)
      throw new Error('permitNumber and date are required for this query')
  })

  return fql`
    let records = ${records as any}

    records.forEach(record => {
      let permitNumber = record.permitNumber
      let year = record.year

      administrativeReports.where(.permitNumber == permitNumber && .year == year).forEach(doc => doc!.delete())
    })
  `
}
