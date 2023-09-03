import { fql } from "fauna";

const deleteWellPermitRecordsQuery = (ids: string[]) =>
  fql`
    ${ids}.map(id => wellPermitRecords.byId(id)!.delete())
  `



export default deleteWellPermitRecordsQuery
