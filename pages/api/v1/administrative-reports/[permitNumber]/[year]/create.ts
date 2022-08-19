import { Get, Lambda } from "faunadb";
import { NextApiRequest } from "next";
import { AdministrativeReport } from "../../../../../../interfaces/AdministrativeReport";
import MeterReading from "../../../../../../interfaces/MeterReading";
import faunaClient, { q } from "../../../../../../lib/faunaClient";
import { HttpError } from "../../../interfaces/HttpError";
import validateQuery from "../../../validatorFunctions";

async function createAdministrativeReport(req: NextApiRequest): Promise<AdministrativeReport> {
  return new Promise(async (resolve, reject) => {
    const errors = validateQuery(req, [
      'queryExists',
      'bodyExists',
      'permitNumberRequired',
      'yearRequired'
    ]);

    if (errors.length) return reject(errors);

    const { permitNumber, year } = req.query;
    const adminReport = req.body;
    adminReport.permitNumber = permitNumber;
    adminReport.year = year;
    
    const response: any = await faunaClient.query(
      q.Create(q.Collection('administrativeReports'), 
        { data: adminReport }
      )
    ).catch(err => {
      if (err.message === 'instance not unique') {
        errors.push(new HttpError(
          'Record Already Exists',
          `A record already exists for permitNumber: ${permitNumber} and year: ${year}`,
          400
        ));
      } else {
        errors.push({
          ...err, 
          status: err.requestResult.statusCode
        });
      }
      return reject(errors);
    });

    if (!response || !response.data) {
      errors.push(new HttpError(
        'Record Creation Failed',
        `Creation failed for meter reading for permit: ${permitNumber} and year: ${year}`,
        500
      ));
      return reject(errors);
    }

    return resolve(response.data);
  });
}

export default createAdministrativeReport;