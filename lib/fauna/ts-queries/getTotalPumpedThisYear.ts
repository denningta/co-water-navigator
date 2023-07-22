import { Expr } from "faunadb";
import { q } from "../faunaClient";

const getTotalPumpedThisYear = (permitNumber: string | Expr, year: string | Expr) =>
  q.Let(
    {
      pumpedYearToDateArray: q.Map(
        q.Filter(
          q.Map(
            q.Paginate(
              q.Join(
                q.Match(q.Index('meter-readings-by-permitNumber-year'), [permitNumber, year]),
                q.Index('meter-readings-sort-by-date-asc')
              )
            ),
            q.Lambda(
              ['date', 'ref'],
              q.Select(['data'], q.Get(q.Var('ref')))
            )
          ),
          q.Lambda(
            'ref',
            q.ContainsPath(['pumpedYearToDate', 'value'], q.Var('ref'))
          )
        ),
        q.Lambda(
          'ref',
          q.Select(['pumpedYearToDate', 'value'], q.Var('ref'))
        )
      )
    },
    q.If(
      q.IsEmpty(q.Select(['data'], q.Var('pumpedYearToDateArray'))),
      null,
      q.Select(0, q.Max(q.Var('pumpedYearToDateArray'))),
    )
  )

export default getTotalPumpedThisYear
