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
  
  beforeAll(() => {
    prevRecord = {
      permitNumber: 'XX-00002',
      date: '1900-01',
      flowMeter: {
        value: 400
      }
    }
    meterReading = {
      permitNumber: 'XX-00022',
      date: '1900-02',
      flowMeter: {
        value: 500
      },
      pumpedThisPeriod: {
        value: 100
      }
    }
    index = 1
  })

  test('equal to current flowMeter minus prev flowMeter', () => {
    const result = verifyPumpedThisPeriod(meterReading, prevRecord, index)
    expect(result).toBe('no update required')
  })

  test('not equal to current flowMeter minus prev flowMeter', () => {
    meterReading.pumpedThisPeriod = {
      value: 150
    }
    const result = verifyPumpedThisPeriod(meterReading, prevRecord, index)
    
    if (result === 'no update required') {
      throw new Error('Function returned \'no update required\' when an update was required.')
    }

    expect(result.calculationState).toBeTruthy()
    expect(result.calculationMessage).toBeTruthy()
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

    if (!meterReading.flowMeter || !prevRecord.flowMeter) {
      throw new Error('Missing setup data')
    }

    expect(result.value).toBe(meterReading.flowMeter.value - prevRecord.flowMeter.value)
  })
})