/**
 * Tests meterReadings calculations
 * 
 * @group meter-readings
 * @group calculations
 */


import MeterReading from "../../../../../../interfaces/MeterReading"
import verifyPumpedYearToDate from "./verify-pumpedYearToDate"

describe('DBB-004 verification: pumpedYearToDate', () => {

  let meterReadings: MeterReading[]
  let index: number
  let shouldBe: number

  beforeAll(() => {
    meterReadings = [
      {
        permitNumber: 'XX-00002',
        date: '1900-01',
        pumpedThisPeriod: {
          value: 10
        }
      },
      {
        permitNumber: 'XX-00002',
        date: '1900-02',
        pumpedThisPeriod: {
          value: 10
        }
      },
      {
        permitNumber: 'XX-00002',
        date: '1900-03',
        pumpedThisPeriod: {
          value: 15
        }
      },
      {
        permitNumber: 'XX-00002',
        date: '1900-04',
        pumpedThisPeriod: {
          value: 15
        },
        pumpedYearToDate: {
          value: 50
        }
      }
    ]

    index = 3

    shouldBe = meterReadings.reduce((n, {pumpedThisPeriod}) => {
      if (!pumpedThisPeriod) return n
      return n + pumpedThisPeriod.value
    }, 0)
  })

  test('equals the sum of pumpedThisPeriod for all records in the year', () => {
    const result = verifyPumpedYearToDate(meterReadings[index], index, meterReadings)
    expect(result).toBe('no update required')
  })

  test('does not equal the sum of pumpedThisPeriod for all records in the year', () => {
    meterReadings[index].pumpedYearToDate = {
      value: 60
    }

    const result = verifyPumpedYearToDate(meterReadings[index], index, meterReadings)

    if (result === 'no update required') {
      throw new Error('Function returned \'no update required\' when an update was required.')
    }

    expect(result.calculationState).toBe('warning')
    expect(result.calculationMessage).toBeTruthy()
    expect(result.shouldBe).toBe(shouldBe)
  })

  test('fixing error returns to success state', () => {
    meterReadings[index].pumpedYearToDate = {
      value: 50,
      shouldBe: 50,
      calculationState: 'warning',
      calculationMessage: 'Expected: 50'
    }

    const result = verifyPumpedYearToDate(meterReadings[index], index, meterReadings)

    if (result === 'no update required') {
      throw new Error('Function returned \'no update required\' when an update was required.')
    }

    expect(result.shouldBe).toBe(undefined)
    expect(result.calculationState).toBe(undefined)
    expect(result.calculationMessage).toBe(undefined)
  })

  test('if undefined set value to sum of pumpedThisPeriod', () => {
    delete meterReadings[index].pumpedYearToDate
    meterReadings.push({
      permitNumber: 'XX-00002',
      date: '1899-12',
      flowMeter: {
        value: 10
      },
      pumpedThisPeriod: {
        value: 10
      }
    })

    const result = verifyPumpedYearToDate(meterReadings[index], index, meterReadings)

    if (result === 'no update required') {
      throw new Error('Function returned \'no update required\' when an update was required.')
    }

    expect(result.value).toBe(shouldBe)
    expect(result.shouldBe).toBe(undefined)
    expect(result.calculationState).toBe(undefined)
    expect(result.calculationMessage).toBe(undefined)
  })



})

