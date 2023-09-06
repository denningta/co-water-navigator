import { NextApiRequest } from "next";
import fauna from "../../../../lib/fauna/faunaClientV10";
import deleteWellPermitRecordsQuery from "../../../../lib/fauna/ts-queries/well-permit-records/deleteWellPermitRecordsQuery";

const deleteWellPermitRecordsHandler = (req: NextApiRequest) => {
  const { body } = req
  if (!body) throw new Error('A body was not included in the request')

  return deleteWellPermitRecords([...body])
}

export const deleteWellPermitRecords = async (ids: string[]) => {
  try {
    const response = await fauna.query(deleteWellPermitRecordsQuery(ids))
    return response.data

  } catch (error: any) {
    throw new Error(error)
  }
}

export default deleteWellPermitRecordsHandler
