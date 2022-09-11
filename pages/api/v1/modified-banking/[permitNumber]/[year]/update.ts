import { NextApiRequest } from "next";
import { ModifiedBanking } from "../../../../../../interfaces/ModifiedBanking";
import faunaClient, { q } from "../../../../../../lib/fauna/faunaClient";
import { HttpError } from "../../../interfaces/HttpError";
import validateQuery from "../../../validatorFunctions";

function updateModifiedBanking(req: NextApiRequest): Promise<ModifiedBanking> {
  return new Promise(async (resolve, reject) => {
    const errors = validateQuery(req, [
      'bodyExists',
      'queryExists',
      'permitNumberRequired',
      'yearRequired'
    ]);

    if (errors.length) return reject(errors);

    const { permitNumber, year } = req.query;

    const response: any = await faunaClient.query(
      q.Let(
        {
          match: q.Match(q.Index('admin-reports-by-permitnumber-year'), [permitNumber, year])
        },
        q.If(
          q.Exists(q.Var('match')),
          q.Replace(
            q.Select(['ref'], q.Get(
              q.Match(q.Index('admin-reports-by-permitnumber-year'), [permitNumber, year])
            )),
            { data: req.body }
          ),
          q.Create(
            q.Collection('administrativeReports'), 
            { data: 
              { 
                ...req.body, 
                permitNumber: permitNumber, 
                year: year 
              } 
            }
          )
        )
      )
      // q.Update(
      //   q.Select(['ref'], q.Get(
      //     q.Match(q.Index('admin-reports-by-permitnumber-year'), [permitNumber, year])
      //   )),
      //   { data: req.body }
      // )
    ).catch(err => {
      errors.push({
        ...err, 
        status: err.requestResult.statusCode
      });
      return reject(errors);
    })

    if (!response || !response.data) {
      errors.push(new HttpError(
        'Record Update Failed',
        `Creation failed for meter reading for permit: ${permitNumber} and year: ${year}`,
        500
      ));
      return reject(errors);
    }

    return resolve(response.data);
  });
}

export default updateModifiedBanking;
