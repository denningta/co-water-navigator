import { NextApiRequest } from "next";
import { WellPermitDocument } from "../../../../interfaces/WellPermit";
import fauna from "../../../../lib/fauna/faunaClientV10";
import updateWellPermitRecordsQuery from "../../../../lib/fauna/ts-queries/well-permit-records/updateWellPermitRecordsQuery";

const updateWellPermitRecordsHandler = (req: NextApiRequest) => {
  const { body } = req

  if (!body) throw new Error('A body was not included in the request')

  body.forEach((el: WellPermitDocument) => {
    if (!el.id) throw new Error('Invalid request body: property \'id\' was missing from an element')
  })

  return updateWellPermitRecords(body)
}

export const updateWellPermitRecords = async (data: WellPermitDocument[]) => {
  try {
    const response = await fauna.query(updateWellPermitRecordsQuery(data))

    return response.data

  } catch (error: any) {
    throw new Error(error)
  }

}

export default updateWellPermitRecordsHandler
