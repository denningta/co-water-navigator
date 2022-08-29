import { NextApiRequest } from "next";
import MeterReading from "../../../../interfaces/MeterReading";
import faunaClient, { q } from "../../../../lib/fauna/faunaClient";
import { HttpError } from "../interfaces/HttpError";
import validateQuery from "../validatorFunctions";

function listDataSummary(req: NextApiRequest): Promise<any[]> {
  return new Promise(async (resolve, reject) => {
    const errors = validateQuery(req, [
      'queryExists',
      'permitNumberRequired'
    ]);

    if (errors.length) return reject(errors);

    const { permitNumber } = req.query

    const query = 
    q.Let(
      {
        dbb004Years: q.Distinct(q.Map(
          q.Paginate(
              q.Match(q.Index('meter-readings-by-permit-number'), 'XX-00000'),
          ),
          q.Lambda(
            'meterReading', 
            q.Select(['year'], q.Call(q.Function('SplitDate'), q.Select(['data', 'date'], q.Get(q.Var('meterReading')))))
          )
        )),
        dbb013Years: q.Distinct(q.Map(
          q.Paginate(
            q.Match(q.Index('admin-reports-by-permitnumber'), 'XX-00000')
          ),
          q.Lambda(
            'adminReport', 
            q.Select(['data', 'year'], q.Get(q.Var('adminReport')))
          )
        ))
      },
      q.Map(
        q.Distinct(
          q.Prepend(
            q.Select(['data'], q.Var('dbb004Years')), q.Select(['data'], q.Var('dbb013Years'))
          )
        ),
        q.Lambda(
          'year',
          {
            year: q.Var('year'),
            dbb004Summary: q.Select(['data'], q.Map(
              q.Paginate(q.Match(q.Index('meter-readings-by-permitNumber-year'), ['XX-00000', q.Var('year')])),
              q.Lambda(
                'meterReading',
                q.Select(['data'], q.Get(q.Var('meterReading')))
              )
            )),
            dbb013Summary: q.Select(['data'], q.Map(
              q.Paginate(q.Match(q.Index('admin-reports-by-permitnumber-year'), ['XX-00000', q.Var('year')])),
              q.Lambda(
                'adminReport',
                q.Select(['data'], q.Get(q.Var('adminReport')))
              )
            ))
          }
      )
    )
  )

    const response: any = await faunaClient.query(query)
      .catch(err => reject(err));

      if (!response) {
        errors.push(
          new HttpError(
            'No Data',
            `No data found matching the query paramters:` + 
            `'permitNumber': ${permitNumber}`,
            404
          )
        );
    
        reject(errors);
      }

    return resolve(response);
    
  })
}

export default listDataSummary