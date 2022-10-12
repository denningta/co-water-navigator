import { Expr } from "faunadb"
import { q } from "../faunaClient"

const getLastMeterReadingPrevYear = (permitNumber: string | Expr, year: string | Expr) =>
q.Let(
  {
    permitNumber: permitNumber,
    year: year,
    lastMeterReadingPrevYear: 
      q.Reverse(
        q.Map(
          q.Paginate(
            q.Join(
              q.Match(q.Index("meter-readings-by-permitNumber-year"), [
                q.Var("permitNumber"),
                q.ToString(q.Subtract(q.ToInteger(q.Var("year")), 1))
              ]),
              q.Index("meter-readings-sort-by-date-asc")
            )
          ),
          q.Lambda(["date", "ref"], 
              q.Select(['data'], q.Get(q.Var('ref')))
          )
        )
      )
  },
  q.If(
    q.ContainsPath(['data', 0], q.Var('lastMeterReadingPrevYear')),
    q.Select(['data', 0], q.Var('lastMeterReadingPrevYear')),
    []
  )
        
)


export default getLastMeterReadingPrevYear