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

    const { user } = req.query

    if (errors.length) reject(errors);

    const userQuery = user && q.Union(
      !Array.isArray(user)
        ? q.Match(q.Index('wellpermits-by-user'), user)
        : user.map(el => q.Match(q.Index('wellpermits-by-user'), el))
    )

    const query = q.Map(
      q.Paginate(
        q.Intersection(
          [
            userQuery
          ].filter(el => el)
        )
      ),
      (record) => q.Get(record)
    )

    const response = await faunaClient.query(query)
      .then(res => res)
      .catch(err => {
        errors.push(err);
        reject(errors);
        return err;
      });

    if (!response.data) {
      errors.push(
        new HttpError(
          'No Data',
          `An error occured retreiving the data`,
          404
        )
      );
      reject(errors);
    }
    
    resolve(response.data.map((record: any) => record.data)[0]);
  });
}

export default listModifiedBanking;
