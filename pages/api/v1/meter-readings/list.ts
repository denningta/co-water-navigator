import { NextApiRequest } from "next";
import MeterReading from "../../../../interfaces/MeterReading";
import faunaClient, { q } from "../../../../lib/faunaClient";
import validateQuery from "./validatorFunctions";

function listMeterReadings(req: NextApiRequest): Promise<MeterReading[]> {
  return new Promise(async (resolve, reject) => {
    const errors = validateQuery(req, [
      'queryExists',
      'optionalYearValid'
    ]);

    if (errors.length) return reject(errors);

    const { permitNumber, year, date } = req.query;
    
    const query = [
      permitNumber && q.Match(q.Index('meter-readings-by-permit-number'), permitNumber),
      year && q.Match(q.Index('meter-readings-by-year'), year),
      date && q.Match(q.Index('meter-readings-by-date'), date),
    ].filter(el => el)

    console.log(query)

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
