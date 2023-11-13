import { fql } from "fauna";
import MeterReading from "../../../../interfaces/MeterReading";

export default function createMeterReadingQuery(record: MeterReading) {
  return fql`
    let record = ${record as any}

    meterReadings.create(record)
  `

}
