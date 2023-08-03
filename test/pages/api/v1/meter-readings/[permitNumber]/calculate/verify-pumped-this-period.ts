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
    }
  ]
}

export default calculationFn
