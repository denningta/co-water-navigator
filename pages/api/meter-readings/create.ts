import MeterReading from "../../../interfaces/MeterReading";
import faunaClient, { q } from "../../../lib/faunaClient";

function createMeterReading(meterReading: MeterReading) {
  return faunaClient.query(
    q.Create(
      q.Collection('meterReadings'),
      { data: meterReading }
    )
  )
  .then((ret) => ret)
  .catch((err) => Promise.reject(err))
}

export default createMeterReading;