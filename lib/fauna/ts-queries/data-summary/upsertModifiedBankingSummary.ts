import { fql } from "fauna";
import { ModifiedBankingSummary } from "../../../../interfaces/ModifiedBanking";

export default function upsertModifiedBankingSummary(data: ModifiedBankingSummary) {

  return fql`
    let data = ${data as any}
    let document = modifiedBankingSummary.firstWhere(
      .permitNumber == data.permitNumber && 
      .year == data.year
    )

    if (document != null) {
      document.update(data)
    } else {
      modifiedBankingSummary.create(data)
    }
  `


}
