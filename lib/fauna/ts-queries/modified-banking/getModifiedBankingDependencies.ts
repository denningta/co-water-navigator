import { fql } from "fauna";

export default function getModifiedBankingDependencies(permitNumber: string, year: string) {

  return fql`
    let permitNumber = ${permitNumber}
    let year = ${year}
    let lastYear = (year.parseInt() - 1).toString

    let dataLastYear = administrativeReports.firstWhere(.permitNumber == permitNumber && year == lastYear)
    
    let bankingReserveLastYear = {
      if (dataLastYear != null) {
        dataLastYear!.bankingReserveThisYear
      }
    }

    let totalPumpedThisYear = {
      let meterReadingsData = meterReadings.where((doc) => {
        doc.permitNumber == permitNumber
        && parseDate(doc.date).year == year.parseInt()
      })
        .order(asc((doc) => parseDate(doc.date).month))
        .order(asc((doc) => parseDate(doc.date).year)) { date, pumpedThisPeriod, pumpedYearToDate }

      let totalPumpedFromPumpedThisPeriod = {
        let array = meterReadingsData
        .where(el => el.pumpedThisPeriod != null)
        .map(el => el.pumpedThisPeriod?.value)
        .toArray()

        if (array.length > 0) {
          let sum = array
            .aggregate(0, (a, b) => a + b)
          Math.round(sum, 2)
        }

      }

      let totalPumpedFromPumpedYearToDate = {
        let array = meterReadingsData
          .where(el => el.pumpedYearToDate != null)
          .map(el => el.pumpedYearToDate?.value)

        array.reduce((a, b) => {
          Math.max(a, b)
        })
      }

      if (totalPumpedFromPumpedThisPeriod != null) {
        totalPumpedFromPumpedThisPeriod
      } else {
        totalPumpedFromPumpedYearToDate
      }
    }

    {
      dataLastYear: dataLastYear,
      bankingReserveLastYear: bankingReserveLastYear,
      totalPumpedThisYear: totalPumpedThisYear
    }
  `
}


