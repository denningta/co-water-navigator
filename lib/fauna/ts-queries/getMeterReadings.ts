import { Expr } from "faunadb"
import { q } from "../faunaClient"


interface GetMeterReadingProps {
    permitNumbers?: string[] | Expr | Expr[], 
    dates?: string[] | Expr | Expr[], 
    years?: string[] | Expr | Expr[]
}

const getMeterReadings = (
  {  
    permitNumbers, 
    dates, 
    years
  }: GetMeterReadingProps
) => {
  const permitNumberQuery = permitNumbers 
  ? q.Union(
      q.Map(permitNumbers,
        q.Lambda('permitNumber',
          q.Match(q.Index('meter-readings-by-permit-number'), q.Var('permitNumber'))
        )
      )
  )
  : null

  const yearQuery = years 
  ? q.Union(
    q.Map(years,
      q.Lambda('year',
      q.Union(
        q.Match(q.Index('meter-readings-by-year'), q.Var('year')),
        q.Match(
          q.Index('meter-readings-by-date'), 
          q.Concat([q.ToString(q.Subtract(q.ToNumber(q.Var('year')), 1)), '-12'])
        )
      )
      )  
    )
  ) 
  : null

  const dateQuery = dates ? q.Union(
    q.Map(dates,
      q.Lambda('date',
        q.Match(q.Index('meter-readings-by-date'), q.Var('date'))
      )
    ) 
  ) : null
  
  return (
    q.Let(
      {
        preFilter: q.Map(
        q.Paginate(
          q.Intersection(
            [
              permitNumberQuery,
              yearQuery,
              dateQuery
            ].filter(el => el)
          )
        ),
        q.Lambda('record',
          q.Select(['data'], q.Get(q.Var('record')))
        )
      )
      },
      q.Select(['data'], q.Var('preFilter'))
    )
  )
}




export default getMeterReadings