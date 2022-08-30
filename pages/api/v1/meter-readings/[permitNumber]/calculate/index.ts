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

type StatusRecord = {
  flowMeter?: CalculatedValue | 'no update required'
  powerMeter?: CalculatedValue | 'no update required'
  powerConsumptionCoef?: CalculatedValue | 'no update required'
  pumpedThisPeriod?: CalculatedValue | 'no update required' | 'delete me'
  pumpedYearToDate?: CalculatedValue | 'no update required' | 'delete me'
  availableThisYear?: CalculatedValue | 'no update required' | 'delete me'
}

export const calculate = (meterReadings: MeterReading[]): MeterReading[] => {
  const updatedMeterReadings: MeterReading[] = []
  meterReadings.forEach((meterReading, index, meterReadings) => {
    const prevRecord = meterReadings[index - 1];
    const statusRecord: any = {
      ...meterReading
    };
    const valueRecord: MeterReading = {
      ...meterReading
    }
    const updatedRecord: any = {
      ...meterReading
    }

    // TODO: Dynamically query for pumpingLimitThisYear
    const pumpingLimitThisYear = 250

    statusRecord.flowMeter = verifyGreaterThanPrevValue(meterReading, prevRecord, index, 'flowMeter')
      statusRecord.flowMeter !== 'no update required' 
        ? valueRecord.flowMeter = statusRecord.flowMeter 
        : valueRecord.flowMeter = meterReading.flowMeter
    statusRecord.powerMeter = verifyGreaterThanPrevValue(valueRecord, prevRecord, index, 'powerMeter')
      statusRecord.powerMeter !== 'no update required' 
        ? valueRecord.powerMeter = statusRecord.powerMeter 
        : valueRecord.powerMeter = meterReading.powerMeter
    statusRecord.powerConsumptionCoef = verifyEqualToPrevValue(valueRecord, prevRecord, index, 'powerConsumptionCoef')
      statusRecord.powerConsumptionCoef !== 'no update required' 
        ? valueRecord.powerConsumptionCoef = statusRecord.powerConsumptionCoef 
        : valueRecord.powerConsumptionCoef = meterReading.powerConsumptionCoef
    statusRecord.pumpedThisPeriod = verifyPumpedThisPeriod(valueRecord, prevRecord, index)
      statusRecord.pumpedThisPeriod !== 'no update required' 
        ? valueRecord.pumpedThisPeriod = statusRecord.pumpedThisPeriod 
        : valueRecord.pumpedThisPeriod = meterReading.pumpedThisPeriod
    statusRecord.pumpedYearToDate = verifyPumpedYearToDate(valueRecord, index, meterReadings)
      statusRecord.pumpedYearToDate !== 'no update required' 
        ? valueRecord.pumpedYearToDate = statusRecord.pumpedYearToDate 
        : valueRecord.pumpedYearToDate = meterReading.pumpedYearToDate
    statusRecord.availableThisYear = verifyAvailableThisYear(valueRecord, pumpingLimitThisYear, index)


    Object.entries(statusRecord).map(([key, value]) => {
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

    console.log(meterReading)
    console.log(updatedRecord)
    console.log(!_.isEqual(meterReading, updatedRecord))

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

