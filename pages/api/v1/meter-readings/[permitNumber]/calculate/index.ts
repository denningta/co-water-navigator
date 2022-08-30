import { verify } from "crypto";
import { Get } from "faunadb";
import _ from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import MeterReading, { CalculatedValue } from "../../../../../../interfaces/MeterReading";
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

function handler(
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
        res.status(errors[0].status || 500).json({errors: errors})
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

export const calculate = (meterReadings: MeterReading[]): MeterReading[] => {
  const updatedMeterReadings: MeterReading[] = []
  meterReadings.forEach((meterReading, index, meterReadings) => {
    const prevRecord = meterReadings[index - 1];
    const newRecord: any = {};
    const updatedRecord: any = {
      ...meterReading
    }

    // TODO: Dynamically query for pumpingLimitThisYear
    const pumpingLimitThisYear = 250

    newRecord.flowMeter = verifyGreaterThanPrevValue(meterReading, prevRecord, index, 'flowMeter')
    newRecord.powerMeter = verifyGreaterThanPrevValue(meterReading, prevRecord, index, 'powerMeter')
    newRecord.powerConsumptionCoef = verifyEqualToPrevValue(meterReading, prevRecord, index, 'powerConsumptionCoef')
    newRecord.pumpedThisPeriod = verifyPumpedThisPeriod(meterReading, prevRecord, index)

    if (newRecord.pumpedThisPeriod !== 'no update required') {
      meterReading.pumpedThisPeriod = newRecord.pumpedThisPeriod
    }
    newRecord.pumpedYearToDate = verifyPumpedYearToDate(meterReading, index, meterReadings)
    
    if (newRecord.pumpedYearToDate !== 'no update required') {
      meterReading.pumpedYearToDate = newRecord.pumpedYearToDate
    }
    newRecord.availableThisYear = verifyAvailableThisYear(meterReading, pumpingLimitThisYear, index)


    Object.entries(newRecord).map(([key, value]) => {
      if (value === 'no update required') return;
      if (value === 'delete me') {
        delete updatedRecord[key]
        return
      }
      updatedRecord[key] = value;
      updatedRecord.permitNumber = meterReading.permitNumber
      updatedRecord.date = meterReading.date
      return {[key]: value};
    }).filter(value => value !== undefined)

    // console.log(meterReading)
    // console.log(updatedRecord)
    // console.log(!_.isEqual(meterReading, updatedRecord))

    if (!_.isEqual(meterReading, updatedRecord)) {
      updatedMeterReadings.push(updatedRecord)
    }

  })
  
  updatedMeterReadings.filter(obj => obj
    && Object.keys(obj).length !== 0
    && Object.getPrototypeOf(obj) === Object.prototype
  )

  return updatedMeterReadings
}

export default handler;

