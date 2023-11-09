import MeterReading from "../../../../interfaces/MeterReading"
import { q } from "../../faunaClient"

const createMeterReadings = (meterReadings: MeterReading[]) =>
  q.Map(meterReadings,
    (meterReading) => {
      return q.Create(q.Collection('meterReadings'),
        { data: meterReading }
      )
    }
  )

export default createMeterReadings
