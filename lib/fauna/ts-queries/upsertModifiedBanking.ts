import { Expr } from "faunadb";
import { ModifiedBanking } from "../../../interfaces/ModifiedBanking";
import { q } from "../faunaClient";

const upsertModifiedBanking = (permitNumber: string | Expr, year: string | Expr, data: ModifiedBanking) =>
  q.Let(
    {
      match: q.Match(q.Index('admin-reports-by-permitnumber-year'), [permitNumber, year])
    },
    q.If(
      q.Exists(q.Var('match')),
      q.Replace(
        q.Select(['ref'], q.Get(
          q.Match(q.Index('admin-reports-by-permitnumber-year'), [permitNumber, year])
        )),
        {
          data:
          {
            ...data,
            permitNumber: permitNumber,
            year: year
          }
        }
      ),
      q.Create(
        q.Collection('administrativeReports'),
        {
          data:
          {
            ...data,
            permitNumber: permitNumber,
            year: year
          }
        }
      )
    )
  )


export default upsertModifiedBanking
