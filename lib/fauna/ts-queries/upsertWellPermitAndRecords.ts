import { WellPermit } from "../../../interfaces/WellPermit";
import { q } from "../faunaClient";

export const upsertWellPermitAndRecords = (data: WellPermit[]) =>
  q.Let({
    response:
      q.Let({
        wellPermitRecords: upsertWellPermitRecords(data)
      },
        q.Map(q.Var('wellPermitRecords'),
          q.Lambda(['wellPermitRecord'],
            q.Let({
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
                  {
                    data: {
                      permit: q.Select(['permit'], q.Var('wellPermitRecord')),
                      records: [q.Select(['ref'], q.Var('wellPermitRecord'))]
                    }
                  }
                ),
                q.Update(
                  q.Select([0], q.Var('wellPermitRefs')),
                  {
                    data: {
                      records:
                        q.Let({
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


export const upsertWellPermitRecords = (data: WellPermit[]) =>
  q.Let({
    wellPermitRecords:
      q.Map(data,
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

