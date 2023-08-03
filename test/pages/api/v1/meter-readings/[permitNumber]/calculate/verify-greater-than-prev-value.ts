import MeterReading from "../../../../../../../interfaces/MeterReading"
import verifyGreaterThanPrevValue from "../../../../../../../pages/api/v1/meter-readings/[permitNumber]/calculate/verify-greater-than-prev-value"
import { CalculationFn } from "./calculation-functions.test"
import * as meterReadingData from './test-data.json'

const data: MeterReading[] = meterReadingData as any

const calculationFunctionsTest: CalculationFn = {
  name: 'verifyGreaterThanPrevValue',
  fn: verifyGreaterThanPrevValue,
  testCases: [
    () => {
      const index = 4
      const currentRecord = {
        ...data[index],
        flowMeter: { value: 500 },
        powerMeter: { value: 2000 }
      }
      return ({
        test: 'passes validation -> greater than previous value',
        props: {
          currentRecord: currentRecord,
          context: [
            data[0],
            data[1],
            data[2],
            {
              ...data[3],
              flowMeter: { value: 300 },
              powerMeter: { value: 1000 }
            },
            data[4],
          ],
          index: 4,
          fields: ['flowMeter', 'powerMeter']
        },
        expected: (result, field) => expect(result).toEqual(currentRecord[field])
      })
    },


    () => {
      return (
        {
          test: 'fails validation -> less than previous value',
          props: {
            currentRecord: {
              ...data[4],
              flowMeter: {
                value: 10
              },
              powerMeter: {
                value: 1000
              }
            },
            context: [
              data[0],
              data[1],
              data[2],
              {
                ...data[3],
                flowMeter: {
                  value: 400
                },
                powerMeter: {
                  value: 2000
                }
              }
            ],
            index: 4,
            fields: ['flowMeter', 'powerMeter']
          },
          expected: (result) => {
            expect(result).toHaveProperty('calculationMessage')
            expect(result).toHaveProperty('calculationState')
          }
        }
      )
    },
    () => {
      const currentRecord = {
        ...data[4],
        flowMeter: {
          value: 500
        },
        powerMeter: {
          value: 1600
        }
      }
      return ({
        test: 'passes validation -> non-adjacent records or dates',
        props: {
          currentRecord: currentRecord,
          context: [
            data[0],
            data[1],
            data[4],
            data[5]
          ],
          index: 4,
          fields: ['flowMeter', 'powerMeter']
        },
        expected: (result, field) => {
          expect(result).toEqual(currentRecord[field])
        }
      })
    },
  ]
}


export default calculationFunctionsTest
