import { NextApiRequest } from "next";
import { AdministrativeReport } from "../../../../../../interfaces/AdministrativeReport";
import faunaClient, { q } from "../../../../../../lib/faunaClient";
import { HttpError } from "../../../interfaces/HttpError";
import validateQuery from "../../../validatorFunctions";

function updateAdministrativeReport(req: NextApiRequest): Promise<AdministrativeReport> {
  return new Promise(async (resolve, reject) => {
    const errors = validateQuery(req, [
      'bodyExists',
      'queryExists',
      'permitNumberRequired',
      'yearRequired'
    ]);

    if (errors.length) return reject(errors);

    const { permitNumber, year } = req.query;

    const response: any = await faunaClient.query(
      q.Update(
        q.Select(['ref'], q.Get(
          q.Match(q.Index('admin-reports-by-permitnumber-year'), [permitNumber, year])
        )),
        { data: req.body }
      )
    ).catch(err => {
      errors.push({
        ...err, 
        status: err.requestResult.statusCode
      });
      return reject(errors);
    })

    if (!response || !response.data) {
      errors.push(new HttpError(
        'Record Update Failed',
        `Creation failed for meter reading for permit: ${permitNumber} and year: ${year}`,
        500
      ));
      return reject(errors);
    }

    return resolve(response.data);
  });
}

export default updateAdministrativeReport;
