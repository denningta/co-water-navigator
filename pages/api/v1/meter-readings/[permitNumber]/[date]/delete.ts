import { NextApiRequest } from "next";
import MeterReading from "../../../../../../interfaces/MeterReading";
import faunaClient from "../../../../../../lib/fauna/faunaClient";
import deleteMeterReading from "../../../../../../lib/fauna/ts-queries/deleteMeterReading";
import validateQuery from "../../../validatorFunctions";

async function deleteMeterReadingHandler(req: NextApiRequest): Promise<MeterReading> {
  return new Promise(async (resolve, reject) => {
    const errors = validateQuery(req, [
      'queryExists',
      'permitNumberRequired',
      'dateRequired',
      'validDateFormat'
    ]);

    if (errors.length) return reject(errors);

    const { permitNumber, date } = req.query;

    if (!permitNumber || Array.isArray(permitNumber))
      throw new Error('Invalid permitNumber query')

    if (!date || Array.isArray(date))
      throw new Error('Invalid date query')

    const response: any = await faunaClient.query(
      deleteMeterReading(permitNumber, date)
    ).catch(err => {
      errors.push({
        ...err,
        status: err.requestResult.statusCode
      });
      return reject(errors);
    })

    return resolve(response.data);

  });

}

export default deleteMeterReadingHandler;
