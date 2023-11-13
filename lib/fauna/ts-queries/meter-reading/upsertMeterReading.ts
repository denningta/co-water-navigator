import { fql } from "fauna"
import MeterReading from "../../../../interfaces/MeterReading"

export default function upsertMeterReading(permitNumber: string, date: string, data: MeterReading) {
  const updateData = {
    ...data,
    permitNumber: permitNumber,
    date: date,
  }

  return fql`
    let data = ${updateData as any}
    let permitNumber = ${permitNumber}
    let date = ${date}
    
    let document = meterReadings.firstWhere(.permitNumber == permitNumber && .date == date)

    if (document != null) {
      document.update(data)
    } else {
      administrativeReports.create(data)
    }
  `
}
