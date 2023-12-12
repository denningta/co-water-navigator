import MeterReading from "../../../../../../../interfaces/MeterReading"
import verifyPumpedYearToDate from "../../../../../../../pages/api/v1/meter-readings/[permitNumber]/calculate/verify-pumpedYearToDate"
import { CalculationFn } from "./calculation-functions.test"
import * as meterReadingData from './test-data.json'

const importData = meterReadingData as any
const data: MeterReading[] = importData.meterReadings



const calculationFn: CalculationFn = {
  name: 'verifyPumpedYearToDate',
  fn: verifyPumpedYearToDate,
  testCases: [
    () => {
      const currentRecord: MeterReading = {
        ...data[11],
      }

      return ({
        test: 'passes validation: sum of pumpedThisPeriod',
        props: {
          index: 11,
          currentRecord: currentRecord,
          context: data,
          fields: ['pumpedYearToDate'],
        },
        expected: (result) => {
          expect(result).toEqual({ value: 94.94 })
        }
      })

    },
    () => {
      const currentRecord: MeterReading = {
        permitNumber: data[2].permitNumber,
        date: data[2].date,
        flowMeter: {
          value: 'user-deleted',
          source: 'user-deleted'
        }
      }
      const context: MeterReading[] = [
        data[0],
        data[1],
        currentRecord
      ]

      return ({
        test: 'passes validation -> same record has user deleted flowMeter',
        props: {
          index: 2,
          currentRecord: currentRecord,
          context: context,
          fields: ['pumpedYearToDate'],
        },
        expected: (result) => {
          expect(result).toBeUndefined()
        }
      })
    },
    () => {
      const currentRecord = {
        permitNumber: data[3].permitNumber,
        date: data[3].date,
        flowMeter: {
          value: 500
        }
      }
      const context: MeterReading[] = [
        {
          permitNumber: data[1].permitNumber,
          date: data[1].date,
          flowMeter: {
            value: 400
          },
          pumpedThisPeriod: {
            value: 10
          }
        },
        {
          permitNumber: data[2].permitNumber,
          date: data[2].date,
          flowMeter: {
            value: 'user-deleted',
            source: 'user-deleted'
          }
        },
        currentRecord
      ]

      console.log(context)

      return ({
        test: 'passes validation -> previous record has user deleted flowMeter',
        props: {
          index: 2,
          currentRecord: currentRecord,
          context: context,
          fields: ['pumpedYearToDate'],
        },
        expected: (result) => {
          expect(result).toMatchObject({ value: 10 })
        }
      })
    },
    () => {

      const currentRecord: MeterReading = {
        permitNumber: data[4].permitNumber,
        date: data[4].date,
        flowMeter: {
          value: 100
        },
        powerMeter: {
          value: 200
        },
        powerConsumptionCoef: {
          value: 0.5
        },
        pumpedThisPeriod: {
          value: 50
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
          fields: ['pumpedYearToDate'],
        },
        expected: (result) => {
          expect(result).toMatchObject({ value: 50 })
        }
      })
    },
    () => {
      const currentRecord: MeterReading = {
        permitNumber: data[3].permitNumber,
        date: data[3].date,
        flowMeter: {
          value: 50
        },
        powerMeter: {
          value: 200
        },
        powerConsumptionCoef: {
          value: 0.5
        },
        pumpedThisPeriod: {
          value: 50
        }
      }
      const context: MeterReading[] = [
        {
          ...data[3],
          flowMeter: {
            value: 100
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
        test: 'returns calculation when flowMeter, powerMeter and powerCoef are defined ',
        props: {
          index: 1,
          currentRecord: currentRecord,
          context: context,
          fields: ['pumpedYearToDate'],
        },
        expected: (result) => {
          expect(result).toMatchObject({ value: 50 })
        }
      })
    },
    () => {
      const currentRecord: MeterReading = {
        permitNumber: data[3].permitNumber,
        date: data[3].date,
        powerMeter: {
          value: 200
        },
        powerConsumptionCoef: {
          value: 0.5
        },
        pumpedThisPeriod: {
          value: 75
        }
      }
      const context: MeterReading[] = [
        {
          ...data[3],
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
        test: 'returns calculation when flowMeter is undefined, powerMeter and powerCoef are defined',
        props: {
          index: 1,
          currentRecord: currentRecord,
          context: context,
          fields: ['pumpedYearToDate'],
        },
        expected: (result) => {
          expect(result).toMatchObject({ value: 75 })
        }
      })
    }
  ]
}

export default calculationFn
