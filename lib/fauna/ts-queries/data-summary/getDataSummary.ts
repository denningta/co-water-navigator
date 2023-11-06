import { fql } from "fauna";

export default function getDataSummary(permitNumbers: string[]) {

  return fql`
    let permitNumbers = ${permitNumbers}

    let dataSummary = {
      permitNumbers.map(permitNumber => {

        let years = {
          let dbb004Years = {
            let dateArray = meterReadings.where(.permitNumber == permitNumber) {
              date
            }
            dateArray.map(el => parseDate(el.date).year.toString()).toArray()
          }

          let dbb013Years = {
            let yearArray = administrativeReports.where(.permitNumber == permitNumber) {
              year
            }
            yearArray.map(el => el.year).toArray()
          }
          dbb004Years.concat(dbb013Years).distinct().order(asc(v => v))
        }

        years.map(year => {

          let dbb004BankingSummary = getDbb004BankingSummary(permitNumber, year)

          let dbb004Summary = {
            meterReadings.where((doc) => {
              doc.permitNumber == permitNumber && (
                parseDate(doc.date).year == year.parseInt() || (
                  parseDate(doc.date).year == year.parseInt() - 1  &&
                  parseDate(doc.date).month == 12
                )
              )
            }).toArray()
              .order(asc((doc) => parseDate(doc.date).month))
              .order(asc((doc) => parseDate(doc.date).year))
          }

          let dbb013Summary = administrativeReports.firstWhere(.permitNumber == permitNumber && .year == year)

          let wellUsage = wellUsage.firstWhere(.permitNumber == permitNumber && .year == year)

          {
            permitNumber: permitNumber,
            year: year,
            dbb004BankingSummary: dbb004BankingSummary,
            dbb004Summary: dbb004Summary,
            dbb013Summary: dbb013Summary,
            wellUsage: wellUsage
          }
        })

      })
    }

    dataSummary.flatten()
  `

}

