import { NextApiRequest } from "next";
import MeterReading from "../../../../../../interfaces/MeterReading";
import faunaClient, { q } from "../../../../../../lib/fauna/faunaClient";
import validateQuery from "../../../validatorFunctions";
import { runCalculationsInternal } from "../calculate";

function updateMeterReading(req: NextApiRequest): Promise<MeterReading[]> {
  return new Promise(async (resolve, reject) => {
    const errors = validateQuery(req, [
      'bodyExists',
      'queryExists',
      'permitNumberRequired',
      'dateRequired',
      'validDateFormat',
      'validMeterReading'
    ]);

    if (errors.length) reject(errors);

    const { permitNumber, date } = req.query;
    if (!permitNumber || Array.isArray(permitNumber)) {
      reject('PermitNumber does not exist or is an array')
      return
    }

    const response: any = await faunaClient.query(
      q.Let(
        {
          match: q.Match(q.Index('meter-readings-by-permitnumber-date'), [permitNumber, date])
        },
        q.If(
          q.Exists(q.Var('match')),
          q.Replace(
            q.Select(['ref'], q.Get(
              q.Match(q.Index('meter-readings-by-permitnumber-date'), [permitNumber, date])
            )),
            { data: req.body }
          ),
          q.Create(
            q.Collection('meterReadings'),
            {
              data:
              {
                ...req.body,
                permitNumber: permitNumber,
                date: date
              }
            }
          )
        )
      )
    ).catch(err => {
      errors.push({
        ...err,
        status: err.requestResult.statusCode
      });
      reject(errors);
    })

    const calculationUpdates = await runCalculationsInternal(permitNumber)

    resolve(calculationUpdates)
  });
}

export default updateMeterReading;
