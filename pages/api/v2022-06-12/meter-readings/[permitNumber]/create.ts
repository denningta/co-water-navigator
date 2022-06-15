import { Get, Lambda } from "faunadb";
import { NextApiRequest } from "next";
import MeterReading from "../../../../../interfaces/MeterReading";
import faunaClient, { q } from "../../../../../lib/faunaClient";

interface CreateProps {
  records: MeterReading[];
}

async function createMeterReading(
  permitNumber: string | string[], 
  body: NextApiRequest['body']
) {

  const { records }: CreateProps = body;

  const requiredFieldsExist = records.every(meterReading => meterReading.date);

  if (!requiredFieldsExist) {
    return Promise.reject({
      error: 'Missing fields',
      detail: 'The required field "date" is missing from one or more records.',
      status: 400,
      statusDetail: 'Bad Request'
    })
  }

  const dateRegEx: RegExp = /(\d{4})\/(\d{2})/ // RegEx Format: YYYY/MM
  const dateValid = records.every(meterReading => meterReading.date.match(dateRegEx))

  if (!dateValid) {
    return Promise.reject({
      error: 'Invalid Date Format',
      detail: 'One or more records have an invalid date format.  Dates must be formated YYYY/MM',
      status: 400,
      statusDetail: 'Bad Request'
    })
  }


  return faunaClient.query(
    q.Map(records, 
      (meterReading) => {
        return q.Let(
          {
            date: q.Select(['date'], meterReading),
            permitNumber: q.Select(['permitNumber'], meterReading),
            existingRecord: q.Match(
              q.Index('meter-readings-by-permitnumber-date'), [ q.Var('permitNumber'), q.Var('date')]
            )
          },
          q.If(
            q.Exists(q.Var('existingRecord')),
            q.Abort(`A record already exists for well permit: ${q.Var('permitNumber')} and date: ${q.Var('date')}`),
            q.Create(q.Collection('meterReadings'), { data: q.Var('meterReading') })
          )
        )
      }
    )
  )

  // return faunaClient.query(
  //   q.Map(records,
  //     (meterReading) => {
  //       return q.Select(['date'], meterReading)
  //     }  
  //   )
  // )
  .then((ret) => ret)
  .catch((err) => Promise.reject(err))
}

export default createMeterReading;