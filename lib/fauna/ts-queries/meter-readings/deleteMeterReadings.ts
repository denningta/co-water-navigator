import { fql } from "fauna";
import MeterReading from "../../../../interfaces/MeterReading";

export default function deleteMeterReadings(ids: string[]) {
  return fql`
    ${ids}.forEach(id => meterReadings.byId(id)!.delete())
  `
}

export function deleteMeterReadingsByRecord(records: MeterReading[]) {
  records.forEach(record => {
    if (!record.permitNumber || !record.date)
      throw new Error('permitNumber and date are required for this query')
  })

  return fql`
    let records = ${records as any}

    records.forEach(record => {
      let permitNumber = record.permitNumber
      let date = record.date

      meterReadings.where(.permitNumber == permitNumber && .date == date).forEach(doc => doc!.delete())
    })
  `
}
