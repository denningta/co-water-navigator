import { NextApiRequest } from "next";
import MeterReading from "../../../../../../interfaces/MeterReading";
import faunaClient, { q } from "../../../../../../lib/faunaClient";
import validateQuery from "../../validatorFunctions";

async function deleteMeterReading(req: NextApiRequest): Promise<MeterReading> {
  return new Promise(async (resolve, reject) => {
    const errors = validateQuery(req, [
      'queryExists',
      'permitNumberRequired',
      'dateRequired',
      'validDateFormat'
    ]);

    if (errors.length) return reject(errors);

    const { permitNumber, date } = req.query;

    const response: any = await faunaClient.query(
      q.Delete(q.Select(['ref'], q.Get(
        q.Match(q.Index('meter-readings-by-permitnumber-date'), [permitNumber, date])
      )))
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

export default deleteMeterReading;
