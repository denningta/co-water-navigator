import { NextApiRequest } from "next";
import { resolve } from "path";
import MeterReading from "../../../../interfaces/MeterReading";
import faunaClient, { q } from "../../../../lib/faunaClient";
import { HttpError } from "../interfaces/HttpError";
import validateQuery from "../validatorFunctions";

function updateMeterReadings(req: NextApiRequest): Promise<MeterReading[]> {  
  return new Promise(async (resolve, reject) => {
    const errors = validateQuery(req, [
      'queryExists',
      'bodyExists',
      'validMeterReadingsArray'
    ]);

    if (errors.length) reject(errors);

    const meterReadings: MeterReading[] = req.body

    const updateQueries = meterReadings.map(meterReading => {
      return q.Replace(
        q.Select('ref',
          q.Get(
            q.Match(
              q.Index('meter-readings-by-permitnumber-date'), 
              [meterReading.permitNumber, meterReading.date]
            )
          )
        ),
        { data: meterReading }
      )
    })

    const response: any = await faunaClient.query(
      q.Do(updateQueries)
    ).catch(err => {
        errors.push({
          ...err, 
          status: err.requestResult.statusCode
        });
      reject(errors);
    });

    resolve(response.map((el: any) => el.data));
  });
}

export default updateMeterReadings;