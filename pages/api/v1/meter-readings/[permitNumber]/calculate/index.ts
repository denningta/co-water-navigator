import _ from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import MeterReading from "../../../../../../interfaces/MeterReading";
import faunaClient, { q } from "../../../../../../lib/fauna/faunaClient";
import { HttpError } from "../../../interfaces/HttpError";
import validateQuery from "../../../validatorFunctions";
import updateMeterReadings from "../../update";
import verifyAvailableThisYear from "./verify-availableThisYear";
import verifyEqualToPrevValue from "./verify-equal-to-prev-value";
import verifyGreaterThanPrevValue from "./verify-greater-than-prev-value";
import verifyPumpedThisPeriod from "./verify-pumpedThisPeriod";
import verifyPumpedYearToDate from "./verify-pumpedYearToDate";

type HandlerFunctions = {
  [key: string]: (req: NextApiRequest) => Promise<MeterReading[]>
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<MeterReading[] | HttpError> {
  if (!req || !req.method) {
    return Promise.reject(new HttpError(
      'No Request or Invalid Request Method',
      'No request or an invalid request method was sent to the server',
      400
    ));
  }

  const handlers: HandlerFunctions = {
    POST: runCalculationsExternal,
  }

  return handlers[req.method](req)
    .then((response) => {
      res.status(200).json(response);
      return response
    })
    .catch((errors: any) => {
      res.status(errors[0].status || 500).json({ errors: errors })
      return errors
    });
}

const runCalculationsExternal = (req: NextApiRequest): Promise<MeterReading[]> => {
  return new Promise(async (resolve, reject) => {
    const errors = validateQuery(req, [
      'queryExists',
      'permitNumberRequired'
    ]);

    if (errors.length) reject(errors);
    const { permitNumber } = req.query;
    if (!permitNumber) return

    await getMeterReadings(permitNumber)
      .then(res => resolve(calculate(res)))
      .catch(error => reject(error))
  })
}

export const runCalculationsInternal = (permitNumber: string): Promise<MeterReading[]> => {
  return new Promise(async (resolve, reject) => {
    const meterReadings = await getMeterReadings(permitNumber)
      .then(res => res)
      .catch(error => reject(error))

    if (!meterReadings) {
      reject(new HttpError(
        'Meter reading calculations failed: No Data',
        `No data found matching the query paramters: ` +
        `'permitNumber': ${permitNumber}`,
        404
      ))
      return
    }

    await updateMeterReadings(calculate(meterReadings))
      .then(res => resolve(res))
      .catch(error => reject(error))
  })
}

const getMeterReadings = (permitNumber: string | string[]): Promise<MeterReading[]> => {
  return new Promise(async (resolve, reject) => {
    const response: any = await faunaClient.query(
      q.Map(
        q.Paginate(
          q.Join(
            q.Match(q.Index('meter-readings-by-permit-number'), [permitNumber]),
            q.Index('meter-readings-sort-by-date-asc')
          )
        ),
        q.Lambda(
          ['date', 'ref'],
          q.Get(q.Var('ref'))
        )
      )
    ).catch(error => reject(error))

    const meterReadings: MeterReading[] = response.data.map((record: any) => record.data);
    resolve(meterReadings)
  })
}


const calculatedFields = [
  'flowMeter',
  'powerMeter',
  'powerConsumptionCoef',
  'pumpedThisPeriod',
  'pumpedYearToDate',
  'availableThisYear'
]

const calcValue: any = {
  value: 0
}

export const calculate = (meterReadings: MeterReading[]): MeterReading[] => {
  const updatedMeterReadings: MeterReading[] = []
  const refMeterReadings: MeterReading[] = [meterReadings[0]]
  // TODO: Dynamically query for pumpingLimitThisYear
  const pumpingLimitThisYear = undefined

  meterReadings.forEach((meterReading, index, meterReadings) => {
    const prevRecord = meterReadings[index - 1];

    const refRecord = {
      ...meterReading
    }

    refRecord.flowMeter = verifyGreaterThanPrevValue(refRecord, meterReadings, index, 'flowMeter')
    refRecord.powerMeter = verifyGreaterThanPrevValue(refRecord, meterReadings, index, 'powerMeter')
    refRecord.powerConsumptionCoef = verifyEqualToPrevValue(refRecord, meterReadings, index, 'powerConsumptionCoef')
    refRecord.pumpedThisPeriod = verifyPumpedThisPeriod(refRecord, meterReadings, index)
    refMeterReadings[index] = refRecord
    refRecord.pumpedYearToDate = verifyPumpedYearToDate(refRecord, index, refMeterReadings)
    refRecord.availableThisYear = verifyAvailableThisYear(refRecord, pumpingLimitThisYear, meterReadings, index)

    if (index > 0) refMeterReadings.push(refRecord)

    let updateRecord = false
    const keys = Object.keys(refRecord) as (keyof typeof refRecord)[]

    keys.forEach((key) => {
      if (!calculatedFields.includes(key)) return
      if (_.isEqual(refRecord[key], meterReading[key])) return
      if (refRecord[key] === undefined) delete refRecord[key]
      updateRecord = true
    })

    if (refRecord.flowMeter === undefined) {
      delete refRecord.pumpedThisPeriod
      delete refRecord.pumpedYearToDate
      delete refRecord.availableThisYear
    }

    if (!updateRecord) return
    updatedMeterReadings.push(refRecord)
  })

  return updatedMeterReadings
}

export default handler;

