import { fql } from "fauna";
import MeterReading from "../../../../interfaces/MeterReading";

function updateMeterReadingsQuery(data: MeterReading[]) {
  data.forEach(record => {
    if (!record.permitNumber || !record.date)
      throw new Error('permitNumber and date properties are required on each record to be updated')
  })

  return fql`
    let data = ${data as any}

    data.map(record => {
      let permitNumber = record.permitNumber
      let date = record.date

      meterReadings.firstWhere(.permitNumber == permitNumber && .date == date)!.replace(record)
    })
  `
}



export default updateMeterReadingsQuery
