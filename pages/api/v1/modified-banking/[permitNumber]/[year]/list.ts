import { NextApiRequest } from "next";
import { ModifiedBanking } from "../../../../../../interfaces/ModifiedBanking";
import faunaClient, { q } from "../../../../../../lib/fauna/faunaClient";
import { HttpError } from "../../../interfaces/HttpError";
import validateQuery from "../../../validatorFunctions";

function listModifiedBanking(req: NextApiRequest): Promise<ModifiedBanking> {
  return new Promise(async (resolve, reject) => {
    const errors = validateQuery(req, [
      'queryExists',
      'permitNumberRequired',
      'yearRequired',
    ]);

    if (errors.length) reject(errors);

    const {permitNumber, year} = req.query;
    const response = await faunaClient.query(
      q.Map(
        q.Paginate(q.Match(q.Index('admin-reports-by-permitnumber-year'), [permitNumber, year])),
        (adminReport) => {
          return q.Get(adminReport)
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
          `'permitNumber': ${permitNumber} and 'year': ${year}`,
          404
        )
      );
      reject(errors);
    }
    
    resolve(response.data.map((record: any) => record.data)[0]);
  });
}

export default listModifiedBanking;
