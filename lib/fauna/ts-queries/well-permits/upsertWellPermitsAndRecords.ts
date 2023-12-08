import { Document, fql, QueryValue } from "fauna";
import { WellPermit } from "../../../../interfaces/WellPermit";

function upsertWellPermitAndRecords(wellPermits: Array<Document & WellPermit>) {
  const data = wellPermits.map(el => {
    const { id, coll, ts, ...rest } = el

    return rest
  })

  return fql`
    let data = ${data as any}

    let wellPermitRecordsData = data.map(el => {
      let doc = wellPermitRecords.firstWhere(.receipt == el.receipt)

      if (doc != null) {
        doc.replace(el)
      } else {
        wellPermitRecords.create(el)
      }
    })

    let uniquePermits = wellPermitRecordsData.map(doc => doc.permit).distinct()

    uniquePermits.map(permit => {
      let wellPermitUpdate = {
        permit: permit,
        records: wellPermitRecordsData.where(.permit == permit)
      }

      let doc = wellPermits.firstWhere(.permit == permit)

      if (doc != null) {
        doc!.replace(wellPermitUpdate)
      } else {
        wellPermits.create(wellPermitUpdate)
      }
    })
  `

}

export default upsertWellPermitAndRecords
