import MeterReading from "../../../../interfaces/MeterReading";
import faunaClient, { q } from "../../../../lib/fauna/faunaClient";
import { HttpError } from "../interfaces/HttpError";

function updateMeterReadings(meterReadings: MeterReading[]): Promise<MeterReading[]> {
  return new Promise(async (resolve, reject) => {
    const errors: any[] = []

    const updateQueries = meterReadings.map(meterReading => {
      return q.Replace(
        q.Select('ref',
          q.Get(
            q.Match(
              q.Index('meter-readings-by-permitnumber-date'),
              [meterReading.permitNumber, meterReading.date]
            )
          )
        ),
        { data: meterReading }
      )
    })

    const response: any = await faunaClient.query(
      q.Do(updateQueries)
    ).catch(err => {
      errors.push({
        ...err,
        status: err.requestResult.statusCode
      });
      reject(errors);
    });

    if (!response) {
      reject(new HttpError(
        'No data',
        `No data found matching query parameters`,
        404
      ))
      return
    }

    resolve(response.map((el: any) => el.data));
  });
}

export default updateMeterReadings;
