import { fql } from "fauna"

export default function getDbb004BankingSummary(permitNumber: string, year: string) {
  return fql`
    let permitNumber = ${permitNumber}
    let year = ${year}

    let modifiedBanking = administrativeReports.where(.permitNumber == permitNumber && .year == year).first()

    let allowedAppropriation = {
      if (modifiedBanking != null) {
        {
          value: modifiedBanking.allowedAppropriation?.value,
        }
      } else {
        null
      }
    }

    let pumpingLimitThisYear = {
      if (modifiedBanking != null && modifiedBanking.pumpingLimitThisYear != null) {
        {
          value: modifiedBanking.pumpingLimitThisYear?.value 
        }
      } else {
        null
      }
    }

    let flowMeterLimit = {
      let lastMeterReadingPrevYear = meterReadings.where(meterReading => {
        let recordYear = parseDate(meterReading.date).year
        meterReading.permitNumber == permitNumber && recordYear == (year.parseInt() - 1)
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

      if (pumpingLimitThisYear != null && lastFlowMeterPrevYear != null) {
        {
          value: Math.round(pumpingLimitThisYear.value + lastFlowMeterPrevYear, 2)
        }
      } else {
        null
      }
    }
  
    {
      permitNumber: permitNumber,
      year: year,
      bankingData: [
        {
          name: 'allowedAppropriation',
          value: allowedAppropriation
        },
        {
          name: 'pumpingLimitThisYear',
          value: pumpingLimitThisYear
        },
        {
          name: 'flowMeterLimit',
          value: flowMeterLimit
        },
      ]
    }
  `
}
