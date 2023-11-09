import { fql } from "fauna";
import MeterReading from "../../../../interfaces/MeterReading";

export default function createMeterReadings(data: MeterReading[]) {
  return fql`
    let data = ${data as any}

    data.map(el => {
      meterReadings.create(el)
    })
  `
}
