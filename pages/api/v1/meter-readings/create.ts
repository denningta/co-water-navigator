import { Document } from "fauna";
import { NextApiRequest } from "next";
import MeterReading from "../../../../interfaces/MeterReading";
import fauna from "../../../../lib/fauna/faunaClientV10";
import createMeterReadingsQuery from "../../../../lib/fauna/ts-queries/meter-readings/createMeterReadings"

async function createMeterReadings(req: NextApiRequest): Promise<Array<Document & MeterReading>> {
  try {
    const { body } = req

    if (!body) throw new Error('A body was not included in the request but is required')

    const { data } = await fauna.query<Array<Document & MeterReading>>(createMeterReadingsQuery(body))

    return data

  } catch (error: any) {
    throw new Error(error)
  }
}

export default createMeterReadings;
