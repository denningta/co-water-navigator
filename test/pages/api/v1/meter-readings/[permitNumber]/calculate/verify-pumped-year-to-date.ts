import MeterReading from "../../../../../../../interfaces/MeterReading"
import verifyPumpedYearToDate from "../../../../../../../pages/api/v1/meter-readings/[permitNumber]/calculate/verify-pumpedYearToDate"
import { CalculationFn } from "./calculation-functions.test"
import * as meterReadingData from './test-data.json'

const data: MeterReading[] = meterReadingData as any

const calculationFn: CalculationFn = {
  name: 'verifyPumpedYearToDate',
  fn: verifyPumpedYearToDate,
  testCases: [
    () => {
      const currentRecord: MeterReading = {
        ...data[11],
      }
      const context = data
      return ({
        test: 'passes validation: sum of pumpedThisPeriod',
        props: {
          index: 1,
          currentRecord: currentRecord,
          context: data,
          fields: ['pumpedYearToDate'],
        },
        expected: (result) => {
          expect(result).toEqual({ value: 10 })
        }
      })

    }

  ]
}

export default calculationFn
