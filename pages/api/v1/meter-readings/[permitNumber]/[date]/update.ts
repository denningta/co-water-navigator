import { NextApiRequest } from "next";
import { MeterReadingResponse } from ".";
import fauna from "../../../../../../lib/fauna/faunaClientV10";
import upsertMeterReading from "../../../../../../lib/fauna/ts-queries/meter-reading/upsertMeterReading";
import { runCalculationsInternal } from "../calculate";

async function updateMeterReading(req: NextApiRequest) {
  const { body } = req
  const { permitNumber, date } = req.query

  if (!body) throw new Error('A body was not included in the request')

  if (!permitNumber || !date) throw new Error('permitNumber or date query parameters missing.')
  if (Array.isArray(permitNumber) || Array.isArray(date)) throw new Error('An array was provided for permitNumber or date.  Only a single permitNuber and date are allowed at this endpoint')

  try {
    const { data } = await fauna.query<MeterReadingResponse>(upsertMeterReading(permitNumber, date, body))

    const update = await runCalculationsInternal(permitNumber)

    if (!update.length) {
      return [data]
    } else {
      return update
    }

  } catch (error: any) {
    throw new Error(error)
  }
}

export default updateMeterReading;
