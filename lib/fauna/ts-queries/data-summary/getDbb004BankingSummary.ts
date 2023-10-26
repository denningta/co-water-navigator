import { fql } from "fauna"

export default function getDbb004BankingSummary(permitNumber: string, year: string) {
  return fql`
    let permitNumber = ${permitNumber}
    let year = ${year}

    let modifiedBanking = administrativeReports.where(.permitNumber == permitNumber && .year == year).first()

    let allowedAppropriation = {
      if (modifiedBanking != null) {
        modifiedBanking.allowedAppropriation?.value
      } else {
        null
      }
    }

    let pumpingLimitThisYear = {
      if (modifiedBanking != null) {
        modifiedBanking.pumpingLimitThisYear?.value
      } else {
        null
      }
    }

    let flowMeterLimit = {
      let lastMeterReadingPrevYear = meterReadings.where(meterReading => {
        let recordYear = parseDate(meterReading.date).year
        meterReading.permitNumber == permitNumber && recordYear == year.parseInt()
      })
        .order(desc((doc) => parseDate(doc.date).month))
        .order(desc((doc) => parseDate(doc.date).year)).first()

      let lastFlowMeterPrevYear = {
        if (lastMeterReadingPrevYear != null) {
          lastMeterReadingPrevYear.flowMeter?.value
        } else {
          null
        }
      }

      let pumpingLimitThisYear = {
        if (modifiedBanking != null) {
          modifiedBanking.pumpingLimtThisYear?.value
        } else {
          null
        }
      }

      if (pumpingLimitThisYear != null && lastFlowMeterPrevYear != null) {
         pumpingLimitThisYear + lastFlowMeterPrevYear
      } else {
        null
      }
    }
  
    {
      allowedAppropriation: allowedAppropriation,
      pumpingLimitThisYear: pumpingLimitThisYear,
      flowMeterLimit: flowMeterLimit
    }
  `
}
