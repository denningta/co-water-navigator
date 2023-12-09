import { fql } from "fauna";
import { WellUsage } from "../../../../interfaces/ModifiedBanking";

export default function upsertWellUsageQuery(permitNumber: string, year: string, updateData: WellUsage) {
  return fql`
    let permitNumber = ${permitNumber}
    let year = ${year}
    let updateData = ${updateData as any}

    let doc = wellUsage.firstWhere(.permitNumber == permitNumber && .year == year)

    if (doc != null) {
      doc!.replace(updateData)
    } else {
      wellUsage.create(updateData)
    }
  `
}
