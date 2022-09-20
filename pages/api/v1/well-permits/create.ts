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

    req.body.forEach((record: any) => {
      if (!record.permit || !record.receipt) {
        errors.push(new HttpError(
          'Property(s) missing',
          'Permit or receipt property is required and was missing from one or more records',
          500
        ))
      }
    })

    if (errors.length) return reject(errors)

    const permits = await Promise.all(req.body.map(async (permit: { permit: string, receipt: string }) => {
      return await fetch(
        `https://dwr.state.co.us/Rest/GET/api/v2/wellpermits/wellpermit/` +
        `?format=json` +
        `&receipt=${permit.receipt}`
      ).then(res => res.json())
    }))

    const codwrPermits = permits.map(permit => {
      const result = permit.ResultList[0]
      // remove spaces from receipt field - fauna is using this as an index
      result.receipt = result.receipt.replace(/\s/g, '') 
      return result
    })

    const wellPermitRecords = 
      q.Let({
        wellPermitRecords: q.Map(codwrPermits,
          q.Lambda('wellPermit',
            q.Let(
              { 
                receiptRef: q.Select(['data'], 
                  q.Paginate(
                    q.Match(
                      q.Index('well-permit-records-by-receipt'), 
                      [q.Select(['receipt'], q.Var('wellPermit'))]
                    )
                  )
                ) 
              },
              q.If(
                q.IsEmpty(q.Var('receiptRef')),
                q.Create(q.Collection('wellPermitRecords'),
                  { data: q.Var('wellPermit') }
                ),
                q.Replace(q.Select([0], q.Var('receiptRef')), { data: q.Var('wellPermit') })
              )
            )
          )
        )
      },
      q.Map(q.Var('wellPermitRecords'),
        q.Lambda(['wellPermitRecord'],
          {
            permit: q.Select(['data', 'permit'], q.Var('wellPermitRecord')),
            ref: q.Select(['ref'], q.Var('wellPermitRecord'))
          }
        )
      )
    )

    const createOrUpdateWellPermits = q.Let({
      wellPermitRecords: wellPermitRecords
    },
      q.Map(q.Var('wellPermitRecords'),
        q.Lambda(['wellPermitRecord'],
          q.Let(
            {
              wellPermitRefs: q.Select(['data'],
                q.Paginate(
                  q.Match(
                    q.Index('well-permits-by-permit'), 
                    [q.Select(['permit'], q.Var('wellPermitRecord'))]
                  )
                )
              )
            },
            q.If(
              q.IsEmpty(q.Var('wellPermitRefs')),
              q.Create(q.Collection('wellPermits'),
                { data: 
                  { 
                    permit: q.Select(['permit'], q.Var('wellPermitRecord')),
                    records: [ q.Select(['ref'], q.Var('wellPermitRecord')) ]
                  }
                }
              ),
              q.Update(
                q.Select([0], q.Var('wellPermitRefs')),
                { data:
                  {
                    records: 
                      q.Let(
                        {
                          oldRecords: q.Select(['data', 'records'], 
                            q.Get(q.Select([0], q.Var('wellPermitRefs')))
                          ),
                          newRecord: q.Select(['ref'], q.Var('wellPermitRecord')),
                          updatedRecords: q.Append(q.Var('oldRecords'), [q.Var('newRecord')])
                        },
                        q.Distinct(q.Var('updatedRecords'))
                      )
                  }
                }
              )
            )
          )
        )
      )
    )


    const response: any = await faunaClient.query(
      q.Let(
        {
          response: createOrUpdateWellPermits
        },
        q.Distinct(
          q.Map(q.Var('response'),
            q.Lambda('element',
              {
                document_id: q.Select(['ref', 'id'], q.Var('element')),
                permit: q.Select(['data', 'permit'], q.Var('element'))
              }
            )
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
