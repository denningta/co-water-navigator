import MeterReading from "../../../../../../../interfaces/MeterReading"
import verifyEqualToPrevValue from "../../../../../../../pages/api/v1/meter-readings/[permitNumber]/calculate/verify-equal-to-prev-value"
import { CalculationFn } from "./calculation-functions.test"
import * as meterReadingData from './test-data.json'

const importData = meterReadingData as any
const data: MeterReading[] = importData.meterReadings

const calculationFn: CalculationFn = {
  name: 'verifyEqualToPrevValue',
  fn: verifyEqualToPrevValue,
  testCases: [
    () => {
      const index = 4
      const currentRecord = {
        ...data[index]
      }
      return ({
        test: 'passes validation -> equal to previous value',
        props: {
          currentRecord: currentRecord,
          context: data,
          index: index,
          fields: ['powerConsumptionCoef']
        },
        expected: (result, field) => {
          expect(result).toEqual(currentRecord[field])
        }
      })
    },
    () => {
      const index = 4
      const currentRecord: MeterReading = {
        ...data[index],
        powerConsumptionCoef: {
          value: 10,
          source: 'user'
        }
      }
      return ({
        test: 'fails validation -> not equal to previous value',
        props: {
          currentRecord: currentRecord,
          context: data,
          index: index,
          fields: ['powerConsumptionCoef']
        },
        expected: (result, field) => {
          expect(result).toHaveProperty('calculationMessage')
          expect(result).toHaveProperty('calculationState')
        }
      })
    },
    () => {
      const currentRecord: MeterReading = {
        ...data[4],
        powerConsumptionCoef: {
          value: 'user-deleted',
          source: 'user-deleted'
        }
      }
      return ({
        test: 'passes validation -> user deletion',
        props: {
          currentRecord: currentRecord,
          context: data,
          index: 4,
          fields: ['powerConsumptionCoef']
        },
        expected: (result, field) => {
          expect(result).toEqual(currentRecord[field])
        }
      })
    }
  ]
}

export default calculationFn
