import { Document, fql } from "fauna"
import MeterReading from "../../../../interfaces/MeterReading"

export default function upsertMeterReading(permitNumber: string, date: string, data: Document & MeterReading) {

  const {
    coll,
    id,
    ts,
    ...rest
  } = data

  const updateData = {
    ...rest,
    permitNumber,
    date
  }

  return fql`
    let data = ${updateData as any}
    let permitNumber = ${permitNumber}
    let date = ${date}
    
    let document = meterReadings.firstWhere(.permitNumber == permitNumber && .date == date)

    if (document != null) {
      document.update(data)
    } else {
      meterReadings.create(data)
    }
  `
}
