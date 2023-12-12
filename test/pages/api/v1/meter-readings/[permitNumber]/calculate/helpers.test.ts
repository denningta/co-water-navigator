import MeterReading, { CalculatedValue } from "../../../../../../../interfaces/MeterReading"
import { getLastFlowMeterPrevYears, getPreviousValidCalculatedValues, isDefined, sumCalculatedValues } from "../../../../../../../pages/api/v1/meter-readings/[permitNumber]/calculate/helpers"
import * as meterReadingData from './test-data.json'

const importData = meterReadingData as any
const data: MeterReading[] = importData.meterReadings

describe('calculation helpers', () => {

  describe('getLastFlowMeterLastYear', () => {
    const currentRecord = data[7]
    const addedRecord = {
      permitNumber: data[0].permitNumber,
      date: '1990-01',
      flowMeter: {
        value: 100
      }
    }
    const context = [
      addedRecord,
      data[1],
      data[2],
      data[3],
      data[4],
      data[5],
      data[6],
      currentRecord
    ]

    test('get last valid flow meter previous to this year', () => {
      const result = getLastFlowMeterPrevYears(context, currentRecord)
      expect(result).toBe(addedRecord.flowMeter)
    })
  })

  describe('sumCalculatedValues', () => {

    test('get the sum of values for a CalculatedValue field', () => {
      const result = sumCalculatedValues(data, 'pumpedThisPeriod')
      expect(result).toBe(94.94)
    })

    test('if all values in field are undefined or user-deleted return undefined', () => {
      const context: MeterReading[] = data.map((el, i) => {
        const {
          pumpedThisPeriod,
          ...rest
        } = el

        if (i === 2) {
          return {
            ...rest,
            pumpedThisPeriod: {
              value: 'user-deleted',
              source: 'user-deleted'
            }
          }
        }

        return rest
      })
      const result = sumCalculatedValues(context, 'pumpedThisPeriod')
      expect(result).toBeUndefined()
    })

  })


  describe('getPreviousValidCalculatedValue', () => {

    test('get previous value that exists', () => {
      const context: MeterReading[] = data
      const meterReading = data[4]

      const prevValue = getPreviousValidCalculatedValues(meterReading, 4, context)

      expect(prevValue.prevFlowMeter).toMatchObject(context[3].flowMeter as CalculatedValue)
      expect(prevValue.prevPowerMeter).toMatchObject(context[3].powerMeter as CalculatedValue)

    })

    test('prev flow meter is user-deleted', () => {
      const context: MeterReading[] = [
        data[0],
        {
          ...data[1],
          flowMeter: {
            value: 'user-deleted',
            source: 'user-deleted'
          }
        },
        data[2]
      ]
      const meterReading = {
        ...data[2]
      }
      const prevValue = getPreviousValidCalculatedValues(meterReading, 2, context)

      expect(prevValue.prevFlowMeter).toMatchObject(context[0].flowMeter as CalculatedValue)
    })

    test('prev power meter is user-deleted', () => {
      const context: MeterReading[] = [
        data[0],
        {
          ...data[1],
          powerMeter: {
            value: 'user-deleted',
            source: 'user-deleted'
          }
        },
        data[2]
      ]
      const meterReading = {
        ...data[2]
      }
      const prevValue = getPreviousValidCalculatedValues(meterReading, 2, context)

      expect(prevValue.prevPowerMeter).toMatchObject(context[0].powerMeter as CalculatedValue)
    })
  })

  describe('isNotDefined', () => {

    test('calcValue defined returns true', () => {
      const result = isDefined({ value: 100 })
      expect(result).toBe(true)
    })

    test('calcValue undefined returns false', () => {
      const result = isDefined(undefined)
      expect(result).toBe(false)
    })

    test('calcValue value undefined returns false', () => {
      // @ts-expect-error
      expect(isDefined({ value: undefined })).toBe(false)
    })

    test('calcValue value is user-deleted returns false', () => {
      expect(isDefined({ value: 'user-deleted' })).toBe(false)
    })

    test('calcValue value NaN returns false', () => {
      expect(isDefined({ value: NaN })).toBe(false)
    })

  })

})
