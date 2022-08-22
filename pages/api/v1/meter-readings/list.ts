import { Expr } from "faunadb";
import { NextApiRequest } from "next";
import MeterReading from "../../../../interfaces/MeterReading";
import faunaClient, { q } from "../../../../lib/fauna/faunaClient";
import validateQuery from "../validatorFunctions";

function listMeterReadings(req: NextApiRequest): Promise<MeterReading[]> {
  return new Promise(async (resolve, reject) => {
    const errors = validateQuery(req, [
      'queryExists',
      'optionalYearValid',
      'permitNumberRequired'
    ]);

    if (errors.length) return reject(errors);

    const { permitNumber, year, date } = req.query;
  


    let permitNumberQuery = permitNumber && q.Union(
      !Array.isArray(permitNumber)
        ? q.Match(q.Index('meter-readings-by-permit-number'), permitNumber)
        : permitNumber.map(el => q.Match(q.Index('meter-readings-by-permit-number'), el))
    )
    

    let yearQuery = year && q.Union(
      !Array.isArray(year) 
        ? q.Match(q.Index('meter-readings-by-year'), year) 
        : year.map(el => q.Match(q.Index('meter-readings-by-year'), el))
    )
      
    let dateQuery = date && q.Union(
      !Array.isArray(date)
        ? q.Match(q.Index('meter-readings-by-date'), date)
        : date.map(el => q.Match(q.Index('meter-readings-by-date'), el))
    )

    const query = [
      permitNumberQuery,
      yearQuery,
      dateQuery
    ].filter(el => el)


    const response: any = await faunaClient.query(
      q.Map(
        q.Paginate(
          q.Intersection(query)
        ),
        (record) => q.Get(record)
      )
    ).catch(err => reject(err));

    return resolve(response.data.map((el: any) => el.data));

  });
}

export default listMeterReadings;
