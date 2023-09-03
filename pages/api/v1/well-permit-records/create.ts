import { NextApiRequest } from "next";
import { WellPermit } from "../../../../interfaces/WellPermit";
import faunaClient from "../../../../lib/fauna/faunaClient";

const createWellPermitRecordsHandler = (req: NextApiRequest) => {
  const { body } = req

  if (!body) throw new Error('A body was not included in the request')

  return createWellPermitRecords(body)
}

export const createWellPermitRecords = async (data: WellPermit[]) => {

  try {
    const response = await faunaClient.query()
    return response

  } catch (error: any) {

  }

}

export default createWellPermitRecordsHandler
