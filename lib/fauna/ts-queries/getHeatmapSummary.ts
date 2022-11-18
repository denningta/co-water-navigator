import { q } from "../faunaClient"
import getDataSummary from "./getDataSummary"

const getHeatmapSummary = (permitNumber: string) => 
  q.Let(
    {
      dataSummary: getDataSummary([permitNumber])
    },
    q.If(
      q.IsNonEmpty(q.Var('dataSummary')),
      q.Map(q.Var('dataSummary'),
        q.Lambda('element',
          q.Let(
            {
              year: q.Select(['year'], q.Var('element')),
              numDbb004: q.Count(q.Select(['dbb004Summary'], q.Var('element'))),
              numDbb013: 
                q.If(
                  q.ContainsPath(['dbb013Summary', 0], q.Var('element')),
                  q.Count(q.ToArray(q.Select(['dbb013Summary', 0], q.Var('element')))),
                  0
                ) 
            },
            {
              year: q.Var('year'),
              total: q.Add(q.Var('numDbb004'), q.Var('numDbb013')),
              percentComplete: 
                q.ToInteger(
                  q.Multiply(
                    q.Divide(
                      q.Add(q.Var('numDbb004'), q.Var('numDbb013')), 
                      q.ToDouble(26)
                    ), 
                    100
                  )
                )
            }
          )
        )
      ),
      []
    )
  )

export default getHeatmapSummary