import { q } from "../faunaClient"
import getMeterReadings from "./getMeterReadings"
import { getWellPermits } from "./getWellPermits"

const getPermitPreview = (document_ids: string[]) =>
q.Let(
  {
    permitData: getWellPermits(document_ids),
    permits: 
      q.Map(
        q.Var('permitData'),
        q.Lambda('element',
          q.If(
            q.ContainsPath(['document', 'permit'], q.Var('element')),
            q.Select(['document', 'permit'], q.Var('element')),
            null
          )
        )
      ),
  },
  q.Map(
    q.Var('permits'),
    q.Lambda('permit',
      q.Let(
        {
          pumpData: 
          q.Map(
            getMeterReadings({ permitNumbers: [q.Var('permit')]} ),
            q.Lambda('meterReading',
              {
                date: q.Select(['date'], q.Var('meterReading')),
                pumpedThisPeriod:                     
                q.If(
                  q.ContainsPath(['pumpedThisPeriod', 'value'], q.Var('meterReading')),
                  q.Select(['pumpedThisPeriod', 'value'], q.Var('meterReading')),
                  null
                )
              }
            )
          ),
        },
        {
          permit: q.Var('permit'),
          pumpData: q.Var('pumpData'),
        }
      )
    )
  )
)

export default getPermitPreview