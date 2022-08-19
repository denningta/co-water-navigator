import { Expr } from "faunadb";
import { NextApiRequest } from "next";
import MeterReading from "../../../../interfaces/MeterReading";
import faunaClient, { q } from "../../../../lib/faunaClient";
import { HttpError } from "../interfaces/HttpError";
import validateQuery from "../validatorFunctions";

function listAdministrativeReports(req: NextApiRequest): Promise<MeterReading[]> {
  return new Promise(async (resolve, reject) => {
    const errors = validateQuery(req, [
      'queryExists',
      'optionalYearValid',
      'permitNumberRequired'
    ]);

    if (errors.length) reject(errors);

    const { permitNumber, year } = req.query;
  
    let permitNumberQuery = permitNumber && q.Union(
      !Array.isArray(permitNumber)
        ? q.Match(q.Index('admin-reports-by-permitnumber'), permitNumber)
        : permitNumber.map(el => q.Match(q.Index('admin-reports-by-permitnumber'), el))
    )
    
    let yearQuery = year && q.Union(
      !Array.isArray(year) 
        ? q.Match(q.Index('admin-reports-by-year'), year) 
        : year.map(el => q.Match(q.Index('admin-reports-by-year'), el))
    )
    
    const query = [
      permitNumberQuery,
      yearQuery,
    ].filter(el => el)

    const response: any = await faunaClient.query(
      q.Map(
        q.Paginate(
          q.Intersection(query)
        ),
        (record) => q.Get(record)
      )
    ).catch(err => reject(err));

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

    resolve(response.data.map((el: any) => el.data));
  });
}

export default listAdministrativeReports;
