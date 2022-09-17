import { NextApiRequest, NextApiResponse } from "next";
import { resolve } from "path";
import MeterReading from "../../../../interfaces/MeterReading";
import faunaClient, { q } from "../../../../lib/fauna/faunaClient";
import { HttpError } from "../interfaces/HttpError";
import validateQuery from "../validatorFunctions";

function createWellPermits(req: NextApiRequest, res: NextApiResponse): Promise<MeterReading[]> {  
  return new Promise(async (resolve, reject) => {
    const errors = validateQuery(req, [
      'queryExists',
      'bodyExists',
    ]);

    if (errors.length) return reject(errors);

    const response: any = await faunaClient.query(
      q.Let({
        wellPermits: q.Map(req.body,
            (wellPermit) => {
              return q.Create(q.Collection('wellPermits'),
                { data: wellPermit }
              )
            }
          )
        },
        q.Map(q.Var('wellPermits'),
          q.Lambda('wellPermit',
            {
              document: q.Select(['data'], q.Var('wellPermit')),
              id: q.Select(['ref', 'id'], q.Var('wellPermit'))
            }
          )
        )
      )
    ).catch(err => {
        errors.push({
          ...err, 
          status: err.requestResult.statusCode
        });
      return reject(errors);
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
    
    return resolve(response);
  });
}

export default createWellPermits;
