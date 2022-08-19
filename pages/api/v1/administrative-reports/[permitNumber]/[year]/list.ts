import { NextApiRequest } from "next";
import { AdministrativeReport } from "../../../../../../interfaces/AdministrativeReport";
import faunaClient, { q } from "../../../../../../lib/faunaClient";
import { HttpError } from "../../../interfaces/HttpError";
import validateQuery from "../../../validatorFunctions";

function listAdministrativeReport(req: NextApiRequest): Promise<AdministrativeReport> {
  return new Promise(async (resolve, reject) => {
    const errors = validateQuery(req, [
      'queryExists',
      'permitNumberRequired',
      'yearRequired',
    ]);

    if (errors.length) reject(errors);

    const {permitNumber, year} = req.query;
    const response = await faunaClient.query(
      q.Map(
        q.Paginate(q.Match(q.Index('admin-reports-by-permitnumber-year'), [permitNumber, year])),
        (adminReport) => {
          return q.Get(adminReport)
        }
      )
    )
      .then(res => res)
      .catch(err => {
        errors.push(err);
        reject(errors);
        return err;
      });

    if (!response.data || response.data.length === 0) {
      errors.push(
        new HttpError(
          'No Data',
          `No data found matching the query paramters:` + 
          `'permitNumber': ${permitNumber} and 'year': ${year}`,
          404
        )
      );
      reject(errors);
    }
    
    resolve(response.data.map((record: any) => record.data)[0]);
  });
}

export default listAdministrativeReport;
