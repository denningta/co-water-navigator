/**
 * Tests meterReadings calculations
 * 
 * @group meter-readings
 * @group calculations
 */

import MeterReading from "../../../../../../interfaces/MeterReading"
import verifyGreaterThanPrevValue from "./verify-greater-than-prev-value"

describe('DBB-004 verification: flowMeter/powerMeter', () => {

  let prevRecord: MeterReading;
  let meterReading: MeterReading;
  let index: number;

  beforeAll(() => {
    prevRecord = {
      permitNumber: 'XX-00002',
      date: '1900-01',
      flowMeter: {
        value: 100
      }
    }
    meterReading = {
      permitNumber: 'XX-00002',
      date: '1900-01',
      flowMeter: {
        value: 200
      }
    }
    index = 1;
  })


  test('flow meter is greater return \'no update required\'', () => {
    const result = verifyGreaterThanPrevValue(meterReading, prevRecord, index, 'flowMeter')
    expect(result).toBe('no update required')
  })

  test('when flow meter is less update record with warning data', () => {
    meterReading.flowMeter = {
      value: 90
    }
    const result = verifyGreaterThanPrevValue(meterReading, prevRecord, index, 'flowMeter')

    if (result === 'no update required') {
      throw new Error('Function returned \'no update required\' when an update was required.')
    }

    expect(result.calculationMessage).toBeTruthy()
    expect(result.calculationState).toBeTruthy()
  })

  test('warning exists but is fixed - record returns to success state', () => {
    meterReading.flowMeter = {
      value: 200,
      calculationState: 'warning',
      calculationMessage: 'Expected a value >= 100 acre feet'
    }

    const result = verifyGreaterThanPrevValue(meterReading, prevRecord, index, 'flowMeter')

    if (result === 'no update required') {
      throw new Error('Function returned \'no update required\' when an update was required.')
    }

    expect(result.calculationState).toBe(undefined)
    expect(result.calculationMessage).toBe(undefined)
  })


})