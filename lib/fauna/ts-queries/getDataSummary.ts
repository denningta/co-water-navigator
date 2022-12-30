import { Expr } from "faunadb";
import { q } from "../faunaClient";
import getLastMeterReadingPrevYear from "./getLastMeterReadingPrevYear";
import getWellUsageQuery from "./getWellUsageQuery";
import getDbb004BankingSummary from "./getDbb004BankingSummary";

const getDataSummary = (permitNumbers: string[]) => 
  q.Reduce(
    q.Lambda(['acc', 'value'],
      q.Append(q.Var('acc'), q.Var('value'))
    ),
    [],
    q.Map(
      permitNumbers,
      q.Lambda(
        'permitNumber',
        getDataSummaryByPermit(q.Var('permitNumber')) 
      )
    )
  )

const getDataSummaryByPermit = (permitNumber: string | Expr) => 
q.Let(
  {
    dbb004Years: q.Distinct(
      q.Map(
        q.Paginate(
            q.Match(q.Index('meter-readings-by-permit-number'), [permitNumber]),
        ),
        q.Lambda(
          'meterReading', 
          q.Select(['year'], 
            q.Call(q.Function('SplitDate'), q.Select(['data', 'date'], q.Get(q.Var('meterReading'))))
          )
        )
      )
    ),
    dbb013Years: q.Distinct(q.Map(
      q.Paginate(
        q.Match(q.Index('admin-reports-by-permitnumber'), [permitNumber])
      ),
      q.Lambda(
        'adminReport', 
        q.Select(['data', 'year'], q.Get(q.Var('adminReport')))
      )
    ))
  },
  q.Map(
    q.Distinct(
      q.Prepend(
        q.Select(['data'], q.Var('dbb004Years')), 
        q.Select(['data'], q.Var('dbb013Years'))
      )
    ),
    q.Lambda(
      'year',
      {
        year: q.Var('year'),
        permitNumber: permitNumber,
        dbb004Summary: 
        q.Prepend(
          getLastMeterReadingPrevYear(permitNumber, q.Var('year')),
          q.Select(['data'], 
            q.Map(
              q.Paginate(
                  q.Match(q.Index('meter-readings-by-permitNumber-year'), [permitNumber, q.Var('year')]),
              ),
              q.Lambda(
                'meterReading',
                q.Select(['data'], 
                  q.Get(q.Var('meterReading'))
                )
              )
            )
          )
        ),
        dbb004BankingSummary: getDbb004BankingSummary(permitNumber, q.Var('year')),
        dbb013Summary: q.Select(['data'], q.Map(
          q.Paginate(
            q.Match(q.Index('admin-reports-by-permitnumber-year'), [permitNumber, q.Var('year')])
          ),
          q.Lambda(
            'adminReport',
            q.Select(['data'], q.Get(q.Var('adminReport')))
          )
        )),
        wellUsage: getWellUsageQuery(permitNumber, q.Var('year'))
      }
    )
  )
)

export default getDataSummary