import { Expr } from "faunadb"
import { q } from "../../faunaClient"

const getModifiedBankingLastYear = (
  permitNumber: string | Expr,
  year: string | Expr
) =>
  q.Let({
    data: q.Map(
      q.Paginate(
        q.Match(q.Index('admin-reports-by-permitnumber-year'), [permitNumber, (+year - 1).toString()])
      ),
      q.Lambda(
        'ref',
        q.Select(['data'], q.Get(q.Var('ref')))
      )
    )
  },
    q.If(
      q.ContainsPath(['data', 0], q.Var('data')),
      q.Select(['data', 0], q.Var('data')),
      null
    )
  )

export default getModifiedBankingLastYear
