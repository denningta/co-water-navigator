import { NextApiRequest } from "next";
import { resolve } from "path";
import MeterReading from "../../../../interfaces/MeterReading";
import faunaClient, { q } from "../../../../lib/faunaClient";
import { HttpError } from "../interfaces/HttpError";
import validateQuery from "./validatorFunctions";

function createMeterReadings(req: NextApiRequest): Promise<MeterReading[]> {  
  return new Promise(async (resolve, reject) => {
    const errors = validateQuery(req, [
      'queryExists',
      'bodyExists',
      'validMeterReadingsArray'
    ]);

    if (errors.length) return reject(errors);

    const response: any = await faunaClient.query(
      q.Map(req.body,
        (meterReading) => {
          return q.Create(q.Collection('meterReadings'),
            { data: meterReading }
          )
        }
      )
    ).catch(err => {
        errors.push({
          ...err, 
          status: err.requestResult.statusCode
        });
      return reject(errors);
    });

    console.log(response);

    return resolve(response.map((el: any) => el.data));
  });
}

export default createMeterReadings;
