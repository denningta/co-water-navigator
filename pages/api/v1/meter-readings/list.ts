import { isString } from "lodash";
import { NextApiRequest } from "next";
import MeterReading from "../../../../interfaces/MeterReading";
import faunaClient, { q } from "../../../../lib/fauna/faunaClient";
import getMeterReadings from "../../../../lib/fauna/ts-queries/getMeterReadings";
import validateQuery from "../validatorFunctions";

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

    const response: any = await faunaClient.query(
      getMeterReadings({
        dates: dates,
        years: years,
        permitNumbers: permitNumbers
      })
    )

    return response
    
  } catch (error: any) {
    return error
  }


}

export default listMeterReadings;
