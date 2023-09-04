import MeterReading from "../../../../../../../interfaces/MeterReading"
import verifyPumpedYearToDate from "../../../../../../../pages/api/v1/meter-readings/[permitNumber]/calculate/verify-pumpedYearToDate"
import { CalculationFn } from "./calculation-functions.test"
import * as meterReadingData from './test-data.json'

const rawData: any = meterReadingData
delete rawData.default

const data: MeterReading[] = Object.keys(rawData).map(key => rawData[key])



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

    }

  ]
}

export default calculationFn
