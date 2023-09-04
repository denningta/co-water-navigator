import { fql, QueryValue } from "fauna";
import { WellPermitDocument } from "../../../../interfaces/WellPermit";


type UpdateData = {
  id: string,
  updateData: QueryValue
}

const updateWellPermitRecordsQuery = (data: WellPermitDocument[]) => {

  const updateData: UpdateData[] = data.map(el => {
    const { id, coll, ts, ...rest } = el

    return {
      id: el.id,
      updateData: rest as QueryValue
    }
  })


  return fql`
    ${updateData}.map(
      el => wellPermitRecords.byId(el.id)!.update(el.updateData)
    )
  `
}



export default updateWellPermitRecordsQuery
