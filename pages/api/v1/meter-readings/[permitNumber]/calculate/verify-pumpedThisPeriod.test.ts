/**
 * Tests meterReadings calculations
 * 
 * @group meter-readings
 * @group calculations
 */

import MeterReading from "../../../../../../interfaces/MeterReading"
import verifyPumpedThisPeriod from "./verify-pumpedThisPeriod"

describe('DBB-004 verification: pumpedThisPeriod', () => {

  let prevRecord: MeterReading
  let meterReading: MeterReading
  let index: number
  let shouldBe: number
  
  beforeAll(() => {
    prevRecord = {
      permitNumber: 'XX-00002',
      date: '1900-01',
      flowMeter: {
        value: 400
      }
    }
    meterReading = {
      permitNumber: 'XX-00002',
      date: '1900-02',
      flowMeter: {
        value: 500
      },
      pumpedThisPeriod: {
        value: 100
      }
    }
    index = 1

    if (!meterReading.flowMeter || !prevRecord.flowMeter) {
      throw new Error('Missing setup data')
    }

    shouldBe = meterReading.flowMeter.value - prevRecord.flowMeter.value
  })

  test('equal to current flowMeter minus prev flowMeter', () => {
    const result = verifyPumpedThisPeriod(meterReading, prevRecord, index)
    expect(result).toBe('no update required')
  })

  test('user enters incorrect value sets warning state', () => {
    meterReading.pumpedThisPeriod = {
      value: 150,
      source: 'user'
    }

    const result = verifyPumpedThisPeriod(meterReading, prevRecord, index)
    
    if (result === 'no update required') {
      throw new Error('Function returned \'no update required\' when an update was required.')
    }

    if (result === 'delete me') {
      throw new Error('Function returned \'delete me\' when an update was required')
    }

    expect(result.calculationState).toBeTruthy()
    expect(result.calculationMessage).toBeTruthy()
    expect(result.shouldBe).toBe(shouldBe)
  })

  test('fixing error in pumpedThisPeriod returns record to success state', () => {
    meterReading = {
      permitNumber: 'XX-00022',
      date: '1900-02',
      flowMeter: {
        value: 500
      },
      pumpedThisPeriod: {
        value: 100,
        calculationState: 'warning',
        calculationMessage: 'Expected: 100 acft'
      }
    }

    const result = verifyPumpedThisPeriod(meterReading, prevRecord, index)

    if (result === 'no update required') {
      throw new Error('Function returned \'no update required\' when an update was required.')
    }
    if (result === 'delete me') {
      throw new Error('Function returned \'delete me\' when an update was required')
    }

    expect(result.shouldBe).toBe(undefined)
    expect(result.calculationState).toBe(undefined)
    expect(result.calculationMessage).toBe(undefined)
  })

  test('if undefined set to value to flowMeter minus prev flowMeter', () => {
    meterReading = {
      permitNumber: 'XX-00022',
      date: '1900-02',
      flowMeter: {
        value: 500
      },
    }

    const result = verifyPumpedThisPeriod(meterReading, prevRecord, index)

    if (result === 'no update required') {
      throw new Error('Function returned \'no update required\' when an update was required.')
    }
    if (result === 'delete me') {
      throw new Error('Function returned \'delete me\' when an update was required')
    }
    if (!meterReading.flowMeter || !prevRecord.flowMeter) {
      throw new Error('Missing setup data')
    }

    expect(result.value).toBe(shouldBe)
    expect(typeof result.value).toBe("number")
    expect(result.shouldBe).toBe(undefined)
    expect(result.calculationState).toBe(undefined)
    expect(result.calculationMessage).toBe(undefined)
  })
})