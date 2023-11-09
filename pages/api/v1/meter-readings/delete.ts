import { Document } from "fauna";
import { NextApiRequest } from "next";
import MeterReading from "../../../../interfaces/MeterReading";
import fauna from "../../../../lib/fauna/faunaClientV10";
import deleteMeterReadingsQuery from "../../../../lib/fauna/ts-queries/meter-readings/deleteMeterReadings"

export async function deleteMeterReadings(req: NextApiRequest) {

  const { body } = req
  if (!body) throw new Error('A body was not included in the request')

  if (!Array.isArray(body)) throw new Error('The requst body must be an array of document ids.  Received an object')

  try {
    const { data } = await fauna.query<Array<Document & MeterReading>>(deleteMeterReadingsQuery(body))
    return data

  } catch (error: any) {
    throw new Error(error)
  }


}
