import { Document } from "fauna";
import { NextApiRequest } from "next";
import MeterReading from "../../../../interfaces/MeterReading";
import fauna from "../../../../lib/fauna/faunaClientV10";
import updateMeterReadingsQuery from "../../../../lib/fauna/ts-queries/meter-readings/updateMeterReadings";

async function updateMeterReadings(req: NextApiRequest) {

  const { body } = req

  if (!body) throw new Error('A body was not included in the request')

  try {
    const { data } = await fauna.query<Array<Document & MeterReading>>(updateMeterReadingsQuery(body))
    return data

  } catch (error: any) {
    debugger
    throw new Error(error)
  }
}

export default updateMeterReadings;
