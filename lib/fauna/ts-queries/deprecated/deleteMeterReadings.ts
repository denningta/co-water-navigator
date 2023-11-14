import MeterReading from "../../../../interfaces/MeterReading";
import { q } from "../../faunaClient";
import deleteMeterReading from "./deleteMeterReading";

const deleteMeterReadings = (meterReadings: MeterReading[]) =>
  q.Map(meterReadings,
    q.Lambda('meterReading',
      q.Let({
        permitNumber: q.Select('permitNumber', q.Var('meterReading')),
        date: q.Select('date', q.Var('meterReading'))
      },
        deleteMeterReading(q.Var('permitNumber'), q.Var('date'))
      )
    )
  )

export default deleteMeterReadings
