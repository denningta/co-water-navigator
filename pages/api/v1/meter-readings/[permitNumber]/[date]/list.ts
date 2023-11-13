import { Document } from "fauna";
import { NextApiRequest } from "next";
import MeterReading from "../../../../../../interfaces/MeterReading";
import fauna from "../../../../../../lib/fauna/faunaClientV10";
import getMeterReading from "../../../../../../lib/fauna/ts-queries/meter-reading/getMeterReading";

async function listMeterReading(req: NextApiRequest) {

  const { permitNumber, date } = req.query;

  if (!permitNumber || !date) throw new Error('permitNumber and date are required for this query')

  if (Array.isArray(permitNumber)) throw new Error('Only a single permitNumber is allowed to be queried at a time with this endpoint')
  if (Array.isArray(date)) throw new Error('Only a single date is allowed to be queried at a time with this endpoint')

  try {

    const { data } = await fauna.query<Document & MeterReading>(getMeterReading(permitNumber, date))

    return data

  } catch (error: any) {
    throw new Error(error)
  }


}

export default listMeterReading;
