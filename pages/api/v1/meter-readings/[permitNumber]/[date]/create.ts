import { Get, Lambda } from "faunadb";
import { NextApiRequest } from "next";
import MeterReading from "../../../../../../interfaces/MeterReading";
import faunaClient, { q } from "../../../../../../lib/faunaClient";
import { HttpError } from "../../../interfaces/HttpError";
import validateQuery from "../../validatorFunctions";

interface CreateProps {
  records: MeterReading[];
}

async function createMeterReading(req: NextApiRequest): Promise<MeterReading> {
  return new Promise(async (resolve, reject) => {
    const errors = validateQuery(req, [
      'permitNumberRequired',
      'dateRequired',
      'validDateFormat'
    ]);

    const { permitNumber, date } = req.query;
    const meterReading = req.body;
    meterReading.permitNumber = permitNumber;
    meterReading.date = date;
    
    const response: any = await faunaClient.query(
      q.Create(q.Collection('meterReadings'), 
        { data: meterReading }
      )
    ).catch(err => {
      if (err.message === 'instance not unique') {
        errors.push(new HttpError(
          'Record Already Exists',
          `A record already exists for permitNumber: ${permitNumber} and date: ${date}`,
          400
        ));
      } else {
        errors.push({
          ...err, 
          status: err.requestResult.statusCode
        });
      }

      reject(errors);
      return err;
    })

    console.log(response)

    if (!response.data) {
      errors.push(new HttpError(
        'Record Creation Failed',
        `Creation failed for meter reading for permit: ${permitNumber} and date: ${date}`,
        500
      ))
    }

    resolve(response.data);
  });
}

export default createMeterReading;