import { fql, QueryValue } from "fauna";
import { WellPermit } from "../../../../interfaces/WellPermit";


const createWellPermitRecordsQuery = (data: WellPermit[]) => {
  return fql`
    ${data as QueryValue[]}.map(wellPermit => wellPermitRecords.create(wellPermit))
  `

}





export default createWellPermitRecordsQuery
