import { NextApiRequest } from "next";
import MeterReading from "../../../../../../interfaces/MeterReading";
import faunaClient, { q } from "../../../../../../lib/fauna/faunaClient";
import validateQuery from "../../../validatorFunctions";

function updateMeterReading(req: NextApiRequest): Promise<MeterReading> {
  return new Promise(async (resolve, reject) => {
    const errors = validateQuery(req, [
      'bodyExists',
      'queryExists',
      'permitNumberRequired',
      'dateRequired',
      'validDateFormat',
      'validMeterReading'
    ]);

    if (errors.length) return reject(errors);

    const { permitNumber, date } = req.query;

    const response: any = await faunaClient.query(
      q.Update(
        q.Select(['ref'], q.Get(
          q.Match(q.Index('meter-readings-by-permitnumber-date'), [permitNumber, date])
        )),
        { data: req.body }
      )
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

export default updateMeterReading;
