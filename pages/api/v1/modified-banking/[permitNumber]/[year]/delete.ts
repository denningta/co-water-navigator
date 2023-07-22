import { NextApiRequest, NextApiResponse } from "next";
import { ModifiedBanking } from "../../../../../../interfaces/ModifiedBanking";
import faunaClient, { q } from "../../../../../../lib/fauna/faunaClient";
import { HttpError } from "../../../interfaces/HttpError";
import validateQuery from "../../../validatorFunctions";

async function deleteModifiedBanking(req: NextApiRequest, res: NextApiResponse): Promise<ModifiedBanking> {
  return new Promise(async (resolve, reject) => {
    const errors = validateQuery(req, [
      'queryExists',
      'permitNumberRequired',
      'yearRequired'
    ]);

    if (errors.length) return reject(errors);

    const { permitNumber, year } = req.query;

    const response: any = await faunaClient.query(
      q.Delete(q.Select(['ref'], q.Get(
        q.Match(q.Index('admin-reports-by-permitnumber-year'), [permitNumber, year])
      )))
    ).catch(err => {
      errors.push({
        ...err,
        status: err.requestResult.statusCode
      });
      return reject(errors);
    })

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

    return resolve(response.data);

  });

}

export default deleteModifiedBanking;
