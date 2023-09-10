import { fql } from "fauna";
import getWellPermits from "../well-permits/getWellPermits";

const getPermitPreview = (ids: string[]) =>
  fql`

    let permitNumbers = () => {
      let getWellPermits = () => {
        ${getWellPermits({ ids: ids })}
      }

      let getPermitNumbers = (array) => {
        (array { permit }).distinct()
          .map(el => el.permit)
      }

      getPermitNumbers(getWellPermits())
    }

    let getPumpData = (permitNumber) => {
      meterReadings.where(.permitNumber == permitNumber).toArray().map(el => {
        ({
          date: el.date,
          pumpedThisPeriod: el.pumpedThisPeriod?.value
        })

      })
        .order(asc((doc) => parseDate(doc.date).month))
        .order(asc((doc) => parseDate(doc.date).year))
    }

    permitNumbers().map(permitNumber => {
      ({
        permit: permitNumber,
        pumpData: getPumpData(permitNumber)
      })
    })
  `

export default getPermitPreview
