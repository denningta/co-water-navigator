import MeterReading, { CalculatedValue } from "../../../../../../../interfaces/MeterReading"
import { CalculatedField } from "../../../../../../../pages/api/v1/meter-readings/[permitNumber]/calculate"
import testVerifyGreaterThanPrevValue from "./verify-greater-than-prev-value"
import testVerifyEqualToPrevValue from "./verify-equal-to-prev-value"
import testVerifyPumpedThisPeriod from "./verify-pumped-this-period"
import * as meterReadingData from './test-data.json'

export interface TestCase {
  test: string
  props: {
    currentRecord: MeterReading
    context: MeterReading[]
    fields: CalculatedField[]
    index: number
  },
  expected: (result: CalculatedValue, field: CalculatedField) => void
}

export interface CalculationFn {
  name: string
  fn: any
  testCases?: Array<() => TestCase>
}

describe('Meter readings calculation functions', () => {
  const calculationFns: CalculationFn[] = [
    testVerifyGreaterThanPrevValue,
    testVerifyEqualToPrevValue,
    testVerifyPumpedThisPeriod,
  ]

  calculationFns.forEach(({ name, fn, testCases }) => {

    describe(name, () => {

      testCases && testCases.forEach((testCase) => {
        const { test, props, expected } = testCase()
        const { currentRecord, context, index, fields } = props


        fields.forEach((field) => {

          it(`${field} -> ${test}`, () => {
            const result = fn(currentRecord, context, index, field)
            if (!result) throw new Error('result undefined')
            expected(result, field)
          })

        })

      })

    })

  })
})
