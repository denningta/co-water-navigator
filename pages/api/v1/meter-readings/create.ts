import { NextApiRequest } from "next";
import MeterReading from "../../../../interfaces/MeterReading";
import faunaClient from "../../../../lib/fauna/faunaClient";
import validateQuery from "../validatorFunctions";
import createMeterReadingsFauna from "../../../../lib/fauna/ts-queries/createMeterReadings";

function createMeterReadings(req: NextApiRequest): Promise<MeterReading[]> {
  return new Promise(async (resolve, reject) => {
    const errors = validateQuery(req, [
      'queryExists',
      'bodyExists',
      'validMeterReadingsArray'
    ]);

    if (errors.length) return reject(errors);

    const response: any = await faunaClient.query(
      createMeterReadingsFauna(req.body)
    ).catch(err => {
      errors.push({
        ...err,
        status: err.requestResult.statusCode
      });
      return reject(errors);
    });

    return resolve(response.map((el: any) => el.data));
  });
}

export default createMeterReadings;
