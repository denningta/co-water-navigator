import { warn } from "console"
import MeterReading from "../../../../../../../interfaces/MeterReading"
import verifyPumpedThisPeriod from "../../../../../../../pages/api/v1/meter-readings/[permitNumber]/calculate/verify-pumpedThisPeriod"
import { CalculationFn } from "./calculation-functions.test"
import * as meterReadingData from './test-data.json'

const data: MeterReading[] = meterReadingData as any

const calculationFn: CalculationFn = {
  name: 'verifyPumpedThisPeriod',
  fn: verifyPumpedThisPeriod,
  testCases: [
    () => {
      const index = 4
      const currentRecord = {
        permitNumber: data[index].permitNumber,
        date: data[index].date,
        flowMeter: {
          value: 100
        }
      }
      const context = [
        {
          permitNumber: data[index - 1].permitNumber,
          date: data[index - 1].date,
          flowMeter: {
            value: 75
          }
        },
        currentRecord
      ]
      return (
        {
          test: 'passes validation -> = flowMeter - prevFlowMeter',
          props: {
            index: 1,
            currentRecord: currentRecord,
            context: context,
            fields: ['pumpedThisPeriod']
          },
          expected: (result, field) => {
            expect(result).toEqual({
              value: 25
            })
          }
        }
      )
    },
    () => {
      const index = 4
      const currentRecord: MeterReading = {
        permitNumber: data[index].permitNumber,
        date: data[index].date,
        flowMeter: {
          value: 200
        },
        pumpedThisPeriod: {
          value: 30,
          source: 'user'
        }
      }
      const context = [
        {
          ...data[index - 1],
          flowMeter: {
            value: 100
          },
          currentRecord
        }
      ]
      return ({
        test: 'fails validation -> flowMeter - prevFlowMeter (user input)',
        props: {
          index: 1,
          currentRecord: currentRecord,
          context: context,
          fields: ['pumpedThisPeriod']
        },
        expected: (result, field) => {
          expect(result).toHaveProperty('calculationMessage')
          expect(result).toHaveProperty('calculationState')
        }
      })
    },
    () => {
      const index = 4
      const currentRecord: MeterReading = {
        permitNumber: data[index].permitNumber,
        date: data[index].date,
        flowMeter: {
          value: 200
        },
        pumpedThisPeriod: {
          value: 30,
        }
      }
      const context = [
        {
          ...data[index - 1],
          flowMeter: {
            value: 100
          },
          currentRecord
        }
      ]
      return ({
        test: 'fails validation -> overwrite non-user input',
        props: {
          index: 1,
          currentRecord: currentRecord,
          context: context,
          fields: ['pumpedThisPeriod']
        },
        expected: (result) => {
          expect(result).toEqual({
            value: 100
          })
        }
      })
    },
    () => {
      const currentRecord: MeterReading = {
        ...(({ permitNumber, date }) => ({ permitNumber, date }))(data[4])
      }
      const context: MeterReading[] = [
        { ...(({ permitNumber, date }) => ({ permitNumber, date }))(data[3]) },
        { ...(({ permitNumber, date }) => ({ permitNumber, date }))(data[4]), },
      ]
      return ({
        test: 'return undefined -> when dependencies are undefined',
        props: {
          index: 1,
          currentRecord: currentRecord,
          context: context,
          fields: ['pumpedThisPeriod']
        },
        checkResult: false,
        expected: (result) => {
          expect(result).toBeUndefined()
        }
      })
    },
    () => {
      const currentRecord: MeterReading = {
        ...data[4],
        flowMeter: {
          value: 'user-deleted',
          source: 'user-deleted'
        }
      }
      const context: MeterReading[] = data
      return ({
        test: 'return undefined -> same record has user-deleted dependencies',
        props: {
          index: 4,
          currentRecord: currentRecord,
          context: context,
          fields: ['pumpedThisPeriod']
        },
        expected: (result) => {
          expect(result).toBeUndefined()
        }
      })
    },
    () => {
      const context: MeterReading[] = [
        data[0],
        data[1],
        data[2],
        {
          ...data[3],
          flowMeter: {
            value: 'user-deleted',
            source: 'user-deleted'
          }
        },
        data[4]
      ]
      const currentRecord: MeterReading = {
        ...data[4],
      }
      return ({
        test: 'return undefined -> previous record has user-deleted dependencies',
        props: {
          index: 4,
          currentRecord: currentRecord,
          context: context,
          fields: ['pumpedThisPeriod']
        },
        expected: (result) => {
          expect(result).toEqual({ value: 11.26 })
        }
      })
    },
    () => {
      const currentRecord: MeterReading = {
        ...data[4],
        flowMeter: {
          value: 100
        },
        powerMeter: {
          value: 200
        },
        powerConsumptionCoef: {
          value: 0.5
        }
      }
      const context: MeterReading[] = [
        {
          ...data[3],
          flowMeter: {
            value: 50
          },
          powerMeter: {
            value: 100
          },
          powerConsumptionCoef: {
            value: 0.5
          }
        },
        currentRecord
      ]

      return ({
        test: 'returns calculation when flowMeter, powerMeter and powerCoef are defined',
        props: {
          index: 1,
          currentRecord: currentRecord,
          context: context,
          fields: ['pumpedThisPeriod']
        },
        expected: (result) => {
          expect(result).toEqual({ value: 50 })
        }
      })
    },
    () => {
      const currentRecord: MeterReading = {
        ...data[4],
        flowMeter: {
          value: 100
        },
        powerMeter: {
          value: 250
        },
        powerConsumptionCoef: {
          value: 0.5
        }
      }
      const context: MeterReading[] = [
        {
          ...data[3],
          flowMeter: {
            value: 50
          },
          powerMeter: {
            value: 100
          },
          powerConsumptionCoef: {
            value: 0.5
          }
        },
        currentRecord
      ]

      return ({
        test: 'returns calculation when flowMeter, powerMeter and powerCoef are defined -> out of tolerance warning',
        props: {
          index: 1,
          currentRecord: currentRecord,
          context: context,
          fields: ['pumpedThisPeriod']
        },
        expected: (result) => {
          expect(result).toMatchObject({ value: 50 })
          expect(result).toHaveProperty('calculationMessage')
        }
      })
    },
    () => {
      const currentRecord: MeterReading = {
        ...data[4],
        powerMeter: {
          value: 250
        },
        powerConsumptionCoef: {
          value: 0.5
        }
      }
      delete currentRecord.flowMeter
      const context: MeterReading[] = [
        {
          ...data[3],
          flowMeter: {
            value: 50
          },
          powerMeter: {
            value: 100
          },
          powerConsumptionCoef: {
            value: 0.5
          }
        },
        currentRecord
      ]

      return ({
        test: 'returns calculation when flowMeter undefined, powerMeter and powerCoef are defined',
        props: {
          index: 1,
          currentRecord: currentRecord,
          context: context,
          fields: ['pumpedThisPeriod']
        },
        expected: (result) => {
          expect(result).toMatchObject({ value: 75 })
        }
      })
    }
  ]
}

export default calculationFn
