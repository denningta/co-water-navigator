import { Document } from "fauna";
import { NextApiRequest } from "next";
import MeterReading from "../../../../interfaces/MeterReading";
import fauna from "../../../../lib/fauna/faunaClientV10";
import updateMeterReadingsQuery from "../../../../lib/fauna/ts-queries/meter-readings/updateMeterReadings";

export default async function updateMeterReadingsHandler(req: NextApiRequest) {

  const { body } = req

  if (!body) throw new Error('A body was not included in the request')

  try {
    const data = await updateMeterReadings(body)
    return data
  } catch (error: any) {
    throw new Error(error)
  }
}

export async function updateMeterReadings(meterReadings: MeterReading[]) {
  try {
    const { data } = await fauna.query<Array<Document & MeterReading>>(updateMeterReadingsQuery(meterReadings))
    return data

  } catch (error: any) {
    throw new Error(error)
  }

}

