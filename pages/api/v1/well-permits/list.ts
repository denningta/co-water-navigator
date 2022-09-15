import { NextApiRequest } from "next";
import { ModifiedBanking } from "../../../../interfaces/ModifiedBanking";
import faunaClient, { q } from "../../../../lib/fauna/faunaClient";
import { HttpError } from "../interfaces/HttpError";
import validateQuery from "../validatorFunctions";

function listModifiedBanking(req: NextApiRequest): Promise<ModifiedBanking> {
  return new Promise(async (resolve, reject) => {
    const errors = validateQuery(req, [
      'queryExists',
    ]);

    const { id } = req.query
    if (!id) throw new Error('id query is undefined')
    
    if (errors.length) reject(errors);

    const query = q.Map(
      Array.isArray(id) ? id : [id],
      q.Lambda('id', 
        {
          document: q.Select(['data'], q.Get(q.Ref(q.Collection('wellPermits'), q.Var('id')))),
          id: q.Var('id')
        }
      )
    )

    const response = await faunaClient.query(query)
      .then(res => res)
      .catch(err => {
        errors.push(err);
        reject(errors);
        return err;
      });

    if (!response) {
      errors.push(
        new HttpError(
          'No Data',
          `An error occured retreiving the data`,
          404
        )
      );
      reject(errors);
    }
    
    resolve(response);
  });
}

export default listModifiedBanking;
