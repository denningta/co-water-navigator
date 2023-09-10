import { fql } from "fauna";

const getWellPermitByPermitNumber = (permitNumber: string) =>
  fql`
    wellPermits.where(.permit == ${permitNumber}).first() {
      id,
      permit,
      records,
      selectedRecord
    }
  `

export default getWellPermitByPermitNumber
