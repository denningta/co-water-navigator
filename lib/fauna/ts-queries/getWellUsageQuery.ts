import { Expr } from "faunadb";
import { q } from "../faunaClient";

const getWellUsageQuery = (permitNumber: string | Expr, year: string | Expr) => 
  q.Let(
    {
      wellUsage: q.Map(
        q.Paginate(
          q.Match(q.Index('wellUsage-by-permitnumber-year'), [permitNumber, year])
        ),
        q.Lambda('el',
          q.Select(['data'], q.Get(q.Var('el')))
        )
      )
    },
    q.If(
      q.ContainsPath(['data', 0], q.Var('wellUsage')),
      q.Select(['data', 0], q.Var('wellUsage')),
      {}
    )
  )

export default getWellUsageQuery