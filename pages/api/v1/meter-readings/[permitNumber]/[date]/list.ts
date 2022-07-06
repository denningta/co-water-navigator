import { NextApiRequest } from "next";
import MeterReading from "../../../../../../interfaces/MeterReading";
import faunaClient, { q } from "../../../../../../lib/faunaClient";
import { HttpError } from "../../../interfaces/HttpError";
import validateQuery from "../../validatorFunctions";

function listMeterReading(req: NextApiRequest): Promise<MeterReading> {
  return new Promise(async (resolve, reject) => {
    const errors = validateQuery(req, [
      'queryExists',
      'permitNumberRequired',
      'dateRequired',
      'validDateFormat',
    ]);

    if (errors.length) reject(errors);

    const {permitNumber, date} = req.query;
    const response = await faunaClient.query(
      q.Map(
        q.Paginate(q.Match(q.Index('meter-readings-by-permitnumber-date'), [permitNumber, date])),
        (meterReading) => {
          return q.Get(meterReading)
        }
      )
    )
      .then(res => res)
      .catch(err => {
        errors.push(err);
        reject(errors);
        return err;
      });

    if (!response.data || response.data.length === 0) {
      errors.push(
        new HttpError(
          'No Data',
          `No data found matching the query paramters:` + 
          `'permitNumber': ${permitNumber} and 'date': ${date}`,
          404
        )
      );
  
      reject(errors);
    }
    
    resolve(response.data.map((record: any) => record.data)[0]);
  });
}

export default listMeterReading;
