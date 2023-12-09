import { Expr } from "faunadb";
import { q } from "../../faunaClient";

const getModifiedBankingQuery = (permitNumber: string | Expr, year: string | Expr) =>
  q.Let(
    {
      modifiedBankingArray:
        q.Map(
          q.Paginate(q.Match(q.Index('admin-reports-by-permitnumber-year'), [permitNumber, year])),
          (adminReport) => {
            return q.Get(adminReport)
          }
        ),
      modifiedBanking:
        q.If(
          q.ContainsPath(['data', 0], q.Var('modifiedBankingArray')),
          q.Select(['data', 0], q.Var('modifiedBankingArray')),
          {}
        )
    },
    q.If(
      q.ContainsPath(['data'], q.Var('modifiedBanking')),
      q.Select(['data'], q.Var('modifiedBanking')),
      null
    )
  )

export default getModifiedBankingQuery
