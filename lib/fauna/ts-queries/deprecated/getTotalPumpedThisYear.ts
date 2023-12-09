import { Expr } from "faunadb";
import { q } from "../../faunaClient";

const getTotalPumpedThisYear = (permitNumber: string | Expr, year: string | Expr) =>
  q.Let(
    {
      meterReadings:
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
      pumpedThisPeriodArray:
        q.Map(
          q.Filter(
            q.Var('meterReadings'),
            q.Lambda(
              'ref',
              q.ContainsPath(['pumpedThisPeriod', 'value'], q.Var('ref'))
            )
          ),
          q.Lambda(
            'ref',
            q.Select(['pumpedThisPeriod', 'value'], q.Var('ref'))
          )
        ),
      pumpedThisPeriodSum:
        q.If(
          q.IsEmpty(q.Select(['data'], q.Var('pumpedThisPeriodArray'))),
          null,
          q.Select(['data', 0], q.Sum(q.Var('pumpedThisPeriodArray'))),
        ),
      pumpedYearToDateArray:
        q.Map(
          q.Filter(
            q.Var('meterReadings'),
            q.Lambda(
              'ref',
              q.ContainsPath(['pumpedYearToDate', 'value'], q.Var('ref'))
            )
          ),
          q.Lambda(
            'ref',
            q.Select(['pumpedYearToDate', 'value'], q.Var('ref'))
          )
        ),
      pumpedYearToDateMax:
        q.If(
          q.IsEmpty(q.Select(['data'], q.Var('pumpedYearToDateArray'))),
          null,
          q.Select(0, q.Max(q.Var('pumpedYearToDateArray'))),
        )
    },
    q.If(
      q.IsNull(q.Var('pumpedThisPeriodSum')),
      q.If(
        q.IsNull(q.Var('pumpedYearToDateMax')),
        null,
        q.Var('pumpedYearToDateMax')
      ),
      q.Var('pumpedThisPeriodSum')
    )
  )

export default getTotalPumpedThisYear
