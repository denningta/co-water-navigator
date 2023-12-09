import { Expr } from "faunadb";
import { q } from "../../faunaClient";

const upsertWellUsageQuery = (permitNumber: string | Expr, year: string | Expr, data: any) =>
  q.Let(
    {
      wellUsage: q.Map(
        q.Paginate(
          q.Match(q.Index('wellUsage-by-permitnumber-year'), [permitNumber, year])
        ),
        q.Lambda('el',
          q.Get(q.Var('el'))
        )
      ),
      response:
        q.If(
          q.ContainsPath(['data', 0], q.Var('wellUsage')),
          q.Replace(q.Select(['data', 0, 'ref'], q.Var('wellUsage')), { data: data }),
          q.Create(q.Collection('wellUsage'), { data: data })
        )
    },
    q.Select(['data'], q.Var('response'))
  )

export default upsertWellUsageQuery
