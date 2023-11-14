import { Document } from "fauna"
import { NextApiRequest } from "next"
import { MeterReadingResponse } from "."
import fauna from "../../../../../../lib/fauna/faunaClientV10"
import createMeterReadingQuery from "../../../../../../lib/fauna/ts-queries/meter-reading/createMeterReading"
import { runCalculationsInternal } from "../calculate"

async function createMeterReading(req: NextApiRequest) {
  const { body } = req
  const { permitNumber, date } = req.query

  if (!body) throw new Error('A body was not included in the request')

  if (!permitNumber || !date) throw new Error('permitNumber or date query parameters missing.')
  if (Array.isArray(permitNumber) || Array.isArray(date)) throw new Error('An array was provided for permitNumber or date.  Only a single permitNuber and date are allowed at this endpoint')

  try {
    const { data } = await fauna.query<MeterReadingResponse>(createMeterReadingQuery(body))

    const update = await runCalculationsInternal(permitNumber)

    return update

  } catch (error: any) {
    throw new Error(error)
  }
}

export default createMeterReading
