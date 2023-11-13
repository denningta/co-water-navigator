import { Document } from "fauna";
import { NextApiRequest } from "next";
import MeterReading from "../../../../../../interfaces/MeterReading";
import fauna from "../../../../../../lib/fauna/faunaClientV10";
import deleteMeterReading from "../../../../../../lib/fauna/ts-queries/meter-reading/deleteMeterReading";

async function deleteMeterReadingHandler(req: NextApiRequest) {
  const { permitNumber, date } = req.query

  if (!permitNumber || !date) throw new Error('permitNumber or date query parameters missing.')
  if (Array.isArray(permitNumber) || Array.isArray(date)) throw new Error('An array was provided for permitNumber or date.  Only a single permitNuber and date are allowed at this endpoint')

  try {
    const { data } = await fauna.query<Document & MeterReading>(deleteMeterReading(permitNumber, date))

    return data

  } catch (error: any) {
    throw new Error(error)
  }

}

export default deleteMeterReadingHandler;
