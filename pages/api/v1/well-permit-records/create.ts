import { NextApiRequest } from "next";
import { WellPermit } from "../../../../interfaces/WellPermit";
import fauna from "../../../../lib/fauna/faunaClientV10";
import createWellPermitRecordsQuery from "../../../../lib/fauna/ts-queries/well-permit-records/createWellPermitRecordsQuery";

const createWellPermitRecordsHandler = (req: NextApiRequest) => {
  const { body } = req

  if (!body) throw new Error('A body was not included in the request')

  return createWellPermitRecords(body)
}

export const createWellPermitRecords = async (data: WellPermit[]) => {
  try {
    const response = await fauna.query(createWellPermitRecordsQuery(data))

    return response.data

  } catch (error: any) {
    throw new Error(error)
  }

}

export default createWellPermitRecordsHandler
