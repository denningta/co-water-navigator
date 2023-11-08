import { fql } from "fauna";

export default function getHeatmapSummary(permitNumber: string) {

  return fql`
    let permitNumber = ${permitNumber}

    let years = meterReadings.where(.permitNumber == permitNumber)!.map(meterReading => {
      parseDate(meterReading.date).year
    }).distinct().order(asc(y => y)).toArray()

    years.map(year => {
      let meterReadings = meterReadings.where((doc) => {
        doc.permitNumber == permitNumber &&
        parseDate(doc.date).year == year
      }).toArray().map(doc => {
        {
          date: doc.date,
          flowMeter: doc.flowMeter,
          powerMeter: doc.powerMeter
        }
      })
        
      let completeCount = meterReadings.filter(el => el.flowMeter != null || el.powerMeter != null).length

      {
        year: year,
        percentComplete: Math.round((completeCount / 12.00) * 100, 0)
      }
    })
  `

}
