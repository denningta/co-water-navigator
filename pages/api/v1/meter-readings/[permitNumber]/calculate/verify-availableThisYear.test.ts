/**
 * Tests meterReadings calculations
 * 
 * @group meter-readings
 * @group calculations
 */

import MeterReading from "../../../../../../interfaces/MeterReading"
import verifyAvailableThisYear from "./verify-availableThisYear"

describe('DBB-004 verification: availiableThisYear', () => {
  let meterReading: MeterReading
  let index: number
  let pumpingLimitThisYear: number
  let shouldBe: number

  beforeAll(() => {
    meterReading = {
      permitNumber: 'XX-00002',
      date: '1900-01',
      flowMeter: { value: 100 },
      pumpedYearToDate: {
        value: 70
      },
      availableThisYear: {
        value: 140
      }
    }
    index = 1
    pumpingLimitThisYear = 210

    if (!meterReading.pumpedYearToDate) {
      throw new Error('Missing test setup information')
    }
    
    shouldBe = pumpingLimitThisYear - meterReading.pumpedYearToDate.value
  })

  test('equal to difference of pumpingLimitThisYear and pumpedYearToDate', () => {
    const result = verifyAvailableThisYear(meterReading, pumpingLimitThisYear, index)
    expect(result).toBe('no update required')
  })

  test('not equal to the difference of pumpingLimitThisYear and pumpedYearToDate', () => {
    meterReading.availableThisYear = {
      value: 200
    }

    const result = verifyAvailableThisYear(meterReading, pumpingLimitThisYear, index)

    if (result === 'no update required') {
      throw new Error('Function returned \'no update required\' when an update was required.')
    }

    if (result === 'delete me') {
      throw new Error('Function returned \'delete me\' when an update was required')
    }

    expect(result.shouldBe).toBe(shouldBe)
    expect(result.calculationState).toBe('warning')
    expect(result.calculationMessage).toBeTruthy()
  })

  test('fixing error returns to success state', () => {
    meterReading.availableThisYear = {
      value: 140,
      shouldBe: 140,
      calculationState: 'warning',
      calculationMessage: 'Expected: 140 acre feet'
    }

    const result = verifyAvailableThisYear(meterReading, pumpingLimitThisYear, index)

    if (result === 'no update required') {
      throw new Error('Function returned \'no update required\' when an update was required.')
    }

    if (result === 'delete me') {
      throw new Error('Function returned \'delete me\' when an update was required')
    }

    expect(result.value).toBe(meterReading.availableThisYear.value)
    expect(result.shouldBe).toBe(undefined)
    expect(result.calculationState).toBe(undefined)
    expect(result.calculationMessage).toBe(undefined)
  })

  test('if undefined set value to difference of pumpingLimitThisYear and pumpedYearToDate', () => {
    delete meterReading.availableThisYear

    const result = verifyAvailableThisYear(meterReading, pumpingLimitThisYear, index)

    if (result === 'no update required') {
      throw new Error('Function returned \'no update required\' when an update was required.')
    }

    if (result === 'delete me') {
      throw new Error('Function returned \'delete me\' when an update was required')
    }

    expect(result.value).toBe(shouldBe)
    expect(result.shouldBe).toBe(undefined)
    expect(result.calculationState).toBe(undefined)
    expect(result.calculationMessage).toBe(undefined)
  })

})