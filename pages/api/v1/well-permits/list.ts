import { NextApiRequest, NextApiResponse } from "next";
import { WellPermitAssignment } from "../../../../interfaces/WellPermit";
import faunaClient, { q } from "../../../../lib/fauna/faunaClient";
import { getWellPermits } from "../../../../lib/fauna/ts-queries/wellPermits";
import { getUser } from "../../auth/[user_id]/get-user";
import { HttpError } from "../interfaces/HttpError";
import validateQuery from "../validatorFunctions";

function listWellPemits(req: NextApiRequest, res: NextApiResponse): Promise<WellPermitAssignment[]> {
  return new Promise(async (resolve, reject) => {
    const errors = validateQuery(req, [
      'queryExists',
    ]);

    if (errors.length) reject(errors);

    const { document_id } = req.query
    if (!document_id) throw new Error('document_id missing from query')
    const document_ids = Array.isArray(document_id) ? document_id : [document_id]

    const response = await faunaClient.query(getWellPermits(document_ids))
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

export default listWellPemits
