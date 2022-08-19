import { verify } from "crypto";
import { Get } from "faunadb";
import { NextApiRequest, NextApiResponse } from "next";
import MeterReading, { CalculatedValue } from "../../../../../../interfaces/MeterReading";
import faunaClient, { q } from "../../../../../../lib/faunaClient";
import { HttpError } from "../../../interfaces/HttpError";
import validateQuery from "../../../validatorFunctions";
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
      POST: queryMeterReadings,
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


export const queryMeterReadings = (req: NextApiRequest): Promise<MeterReading[]> => {
  return new Promise(async (resolve, reject) => {
    const errors = validateQuery(req, [
      'queryExists',
      'permitNumberRequired'
    ]);

    if (errors.length) reject(errors);

    const { permitNumber } = req.query;

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
    ).catch(error => reject(errors.push(error)))

    const meterReadings: MeterReading[] = response.data.map((record: any) => record.data);
    const result = runCalculations(meterReadings)
    resolve(result);
  })
}

export const runCalculations = (meterReadings: MeterReading[]): MeterReading[] => {
  return meterReadings.map((meterReading, index, meterReadings) => {
    const prevRecord = meterReadings[index - 1];
    const newRecord: any = {};

    // TODO: Dynamically query for pumpingLimitThisYear
    const pumpingLimitThisYear = 250

    newRecord.flowMeter = verifyGreaterThanPrevValue(meterReading, prevRecord, index, 'flowMeter')
    newRecord.powerMeter = verifyGreaterThanPrevValue(meterReading, prevRecord, index, 'powerMeter')
    newRecord.powerConsumptionCoef = 
      verifyEqualToPrevValue(meterReading, prevRecord, index, 'powerConsumptionCoef')
    newRecord.pumpedThisPeriod = verifyPumpedThisPeriod(meterReading, prevRecord, index)

    if (newRecord.pumpedThisPeriod !== 'no update required') {
      meterReading.pumpedThisPeriod = newRecord.pumpedThisPeriod
    }
    newRecord.pumpedYearToDate = verifyPumpedYearToDate(meterReading, index, meterReadings)
    
    if (newRecord.pumpedYearToDate !== 'no update required') {
      meterReading.pumpedYearToDate = newRecord.pumpedYearToDate
    }
    newRecord.availableThisYear = verifyAvailableThisYear(meterReading, pumpingLimitThisYear, index)

    const updatedRecord: any = {
      ...meterReading
    }

    Object.entries(newRecord).map(([key, value]) => {
      if (value === 'no update required') return;
      updatedRecord[key] = value;
      updatedRecord.permitNumber = meterReading.permitNumber
      updatedRecord.date = meterReading.date
      return {[key]: value};
    }).filter(value => value !== undefined)

    return updatedRecord;

  }).filter(obj => obj
    && Object.keys(obj).length !== 0
    && Object.getPrototypeOf(obj) === Object.prototype
  )

}

export default handler;

