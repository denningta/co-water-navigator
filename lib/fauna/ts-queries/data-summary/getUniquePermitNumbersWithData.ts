import { fql } from "fauna";

export default function getUniquePermitNumbersWithData() {

  return fql`
    let permitsWithMeterReadings = (meterReadings.all() { permitNumber })
      .map(el => el.permitNumber).distinct().toArray()

    let permitsWithModifiedBanking = (administrativeReports.all(){ permitNumber })
      .map(el => el.permitNumber).distinct().toArray()

    permitsWithMeterReadings.concat(permitsWithModifiedBanking).distinct()
  `

}
