import { Document } from "fauna";
import { isString } from "lodash";
import { NextApiRequest } from "next";
import MeterReading from "../../../../interfaces/MeterReading";
import fauna from "../../../../lib/fauna/faunaClientV10";
import getMeterReadings from "../../../../lib/fauna/ts-queries/meter-readings/getMeterReadings";

async function listMeterReadings(req: NextApiRequest): Promise<MeterReading[]> {
  try {
    const {
      permitNumber,
      year,
      date,
    } = req.query;

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
