import { fql } from "fauna";
import { WellPermitWithRecords } from "../../../../interfaces/WellPermit";

const updateWellPermitByPermitNumber = (permitNumber: string, update: WellPermitWithRecords) => {

  const { selectedRecord, ...rest } = update

  if (!rest && !selectedRecord) throw new Error('invalid body')

  if (!selectedRecord?.id) throw new Error('Selected record must contain an id property')

  return fql`
    let wellPermit = wellPermits.firstWhere(.permit == ${permitNumber})

    let wellPermitRecord = wellPermitRecords.byId(${selectedRecord?.id})

    wellPermit.update(${rest as any})

    wellPermit.update({
      selectedRecord: wellPermitRecord,
    })
  `
}

export default updateWellPermitByPermitNumber
