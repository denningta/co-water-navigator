import { Document } from "fauna";
import { isString } from "lodash";
import { NextApiRequest } from "next";
import MeterReading from "../../../../interfaces/MeterReading";
import fauna from "../../../../lib/fauna/faunaClientV10";
import getMeterReadings from "../../../../lib/fauna/ts-queries/meter-readings/getMeterReadings";

async function listMeterReadings(req: NextApiRequest): Promise<Array<Document & MeterReading>> {
  try {
    const {
      permitNumber,
      year,
      date,
    } = req.query;

    if (!permitNumber && !year && !date) throw new Error('At least one query parameter must be defined: permitNumber, year, or date')

    const dates: string[] | undefined = isString(date) ? [date] : date
    const years: string[] | undefined = isString(year) ? [year] : year
    const permitNumbers: string[] | undefined = isString(permitNumber) ? [permitNumber] : permitNumber

    const { data } = await fauna.query<Array<Document & MeterReading>>(
      getMeterReadings({
        dates: dates,
        years: years,
        permitNumbers: permitNumbers
      })
    )


    return data

  } catch (error: any) {
    return error
  }


}

export default listMeterReadings;
