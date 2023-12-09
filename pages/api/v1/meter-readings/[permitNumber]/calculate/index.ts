import _ from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import MeterReading from "../../../../../../interfaces/MeterReading";
import fauna from "../../../../../../lib/fauna/faunaClientV10";
import verifyAvailableThisYear from "./verify-availableThisYear";
import verifyEqualToPrevValue from "./verify-equal-to-prev-value";
import verifyGreaterThanPrevValue from "./verify-greater-than-prev-value";
import verifyPumpedThisPeriod from "./verify-pumpedThisPeriod";
import verifyPumpedYearToDate from "./verify-pumpedYearToDate";
import getMeterReadingsQuery from "../../../../../../lib/fauna/ts-queries/meter-readings/getMeterReadings"
import { Document } from "fauna";
import updateMeterReadingsQuery from "../../../../../../lib/fauna/ts-queries/meter-readings/updateMeterReadings";
import { MeterReadingResponse } from "../[date]";

type HandlerFunctions = {
  [key: string]: (req: NextApiRequest) => Promise<MeterReadingResponse[]>
};

export default async function calculationsHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<MeterReadingResponse[]> {
  if (!req || !req.method) {
    throw new Error('No Request or Invalid Request Method')
  }

  const handlers: HandlerFunctions = {
    POST: runCalculationsExternal,
  }

  try {
    const response = await handlers[req.method](req)
    res.status(200).json(response)
    return response
  } catch (error: any) {
    res.status(500).json(error)
    throw new Error(error)
  }
}

export const runCalculationsExternal = async (req: NextApiRequest) => {
  const { query } = req
  if (!query) throw new Error('Invalid query')
  const { permitNumber } = query
  if (!permitNumber) throw new Error('No permitNumber parameter was included in the query')
  const permitNumbers = Array.isArray(permitNumber) ? permitNumber : [permitNumber]

  try {
    const { data } = await fauna.query<MeterReadingResponse[]>(getMeterReadingsQuery({
      permitNumbers: permitNumbers
    }))

    const calculations = calculate(data)

    return calculations

  } catch (error: any) {
    throw new Error(error)
  }
}

export const runCalculationsInternal = async (permitNumber: string): Promise<MeterReadingResponse[]> => {
  try {
    const meterReadings = await fauna.query<MeterReadingResponse[]>(getMeterReadingsQuery({
      permitNumbers: [permitNumber]
    }))

    if (!meterReadings.data || !meterReadings.data.length) {
      throw new Error(`No data found matching permit: ${permitNumber}`)
    }

    const calculations = calculate(meterReadings.data)

    const update = calculations.map(({
      coll,
      ts,
      id,
      ...rest
    }) => rest)

    const { data } = await fauna.query<MeterReadingResponse[]>(updateMeterReadingsQuery(update))

    return data

  } catch (error: any) {
    throw new Error(error)
  }
}

export type CalculatedField =
  'flowMeter' |
  'powerMeter' |
  'powerConsumptionCoef' |
  'pumpedThisPeriod' |
  'pumpedYearToDate' |
  'availableThisYear'

export const calculatedFields = [
  'flowMeter',
  'powerMeter',
  'powerConsumptionCoef',
  'pumpedThisPeriod',
  'pumpedYearToDate',
  'availableThisYear'
]

export const calculate = (meterReadings: (Document & MeterReading)[]): (Document & MeterReading)[] => {
  const updatedMeterReadings: MeterReading[] = []
  const refMeterReadings: MeterReading[] = [meterReadings[0]]
  // TODO: Dynamically query for pumpingLimitThisYear
  const pumpingLimitThisYear = undefined

  meterReadings.forEach((meterReading, index, meterReadings) => {
    const refRecord = {
      ...meterReading
    }

    refRecord.flowMeter = verifyGreaterThanPrevValue(refRecord, meterReadings, index, 'flowMeter')
    refRecord.powerMeter = verifyGreaterThanPrevValue(refRecord, meterReadings, index, 'powerMeter')
    refRecord.powerConsumptionCoef = verifyEqualToPrevValue(refRecord, meterReadings, index, 'powerConsumptionCoef')
    refRecord.pumpedThisPeriod = verifyPumpedThisPeriod(refRecord, meterReadings, index)
    refMeterReadings[index] = refRecord
    refRecord.pumpedYearToDate = verifyPumpedYearToDate(refRecord, refMeterReadings, index)
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
      refRecord.pumpedThisPeriod?.source !== 'user' ?? delete refRecord.pumpedThisPeriod
      refRecord.pumpedYearToDate?.source !== 'user' ?? delete refRecord.pumpedYearToDate
      refRecord.availableThisYear?.source !== 'user' ?? delete refRecord.availableThisYear
    }

    if (!updateRecord) return
    updatedMeterReadings.push(refRecord)
  })

  return updatedMeterReadings as MeterReadingResponse[]
}


