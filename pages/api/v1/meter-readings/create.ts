import { NextApiRequest } from "next";
import { resolve } from "path";
import MeterReading from "../../../../interfaces/MeterReading";
import faunaClient, { q } from "../../../../lib/faunaClient";
import validateQuery from "./validatorFunctions";

function createMeterReadings(req: NextApiRequest): Promise<MeterReading[]> {
  console.log(req.body)
  
  return new Promise(async (resolve, reject) => {
    const errors = validateQuery(req, [
      'queryExists',
      'bodyExists',
      'validMeterReadingsArray'
    ]);

    if (errors.length) return reject(errors);

    const response: any = faunaClient.query(
      q.Map(req.body,
        (meterReading) => {
          return q.Create(q.Collection('meterReadings'),
            { data: meterReading }
          )
        }
      )
    )

    return resolve(response.data);
  });
}

export default createMeterReadings;
