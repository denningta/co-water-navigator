import { fql } from "fauna"

export default function getDbb004BankingSummary(permitNumber: string, year: string) {
  return fql`
    let permitNumber = ${permitNumber}
    let year = ${year}

    let calculated = getDbb004BankingSummary(permitNumber, year)!.bankingData
    let userDef = modifiedBankingSummary.firstWhere(.permitNumber == permitNumber && .year == year)?.bankingData

    let baseRows = [
      'allowedAppropriation',
      'pumpingLimitThisYear',
      'flowMeterLimit'
    ]

    let bankingData = baseRows.map(name => {
      let calcValue = calculated.firstWhere(el => el.name == name)?.value
      let userValue = userDef?.firstWhere(el => el.name == name)?.value

      let value = {
        if (calcValue == null && calcValue == null) {
          {
            name: name,
            value: null
          }
        } else if (calcValue == null && userValue != null) {
          {
            name: name,
            value: userValue,
          }
        } else if (calcValue != null && userValue == null) { 
          {
            name: name,
            value: calcValue
          }
        } else {
          if (calcValue?.value != userValue?.value) {
            {
              name: name,
              value: {
                value: userValue?.value,
                shouldBe: calcValue?.value,
                calculationState: 'warning',
                calculationMessage: 'Expected: ' + calcValue?.value.toString()
              }
            }
          } else {
            {
              name: name,
              value: userValue
            }
          }
        }
      }

      value
    })

    {
      permitNumber: permitNumber,
      year: year,
      bankingData: bankingData
    }
  `
}
