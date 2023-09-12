import { fql } from "fauna";
import { WellPermit } from "../../../../interfaces/WellPermit";

const getWellPermitSelectedRecord = (permitNumber: string) =>
  fql`
    let wellPermit = wellPermits.firstWhere(.permit == ${permitNumber})
    let defaultRecord = wellPermit.records[0]
    let selectedRecord = wellPermit.selectedRecord

    if (selectedRecord == null) {
      defaultRecord
    } else {
      selectedRecord
    }
  `

export default getWellPermitSelectedRecord
