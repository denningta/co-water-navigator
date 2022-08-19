/**
 * Tests meterReadings calculations
 * 
 * @group meter-readings
 * @group calculations
 */

 import MeterReading from "../../../../../../interfaces/MeterReading"
import verifyEqualToPrevValue from "./verify-equal-to-prev-value";
 import verifyGreaterThanPrevValue from "./verify-greater-than-prev-value"
 
 describe('DBB-004 verification: powerConsumptionCoef', () => {
 
   let prevRecord: MeterReading;
   let meterReading: MeterReading;
   let index: number;
 
  beforeAll(() => {
    prevRecord = {
      permitNumber: 'XX-00002',
      date: '1900-01',
      powerConsumptionCoef: {
        value: 400
      }
    }
    meterReading = {
      permitNumber: 'XX-00002',
      date: '1900-01',
      powerConsumptionCoef: {
        value: 400
      }
    }
    index = 1;
  })
 
 
   test('value is equal return \'no update required\'', () => {
     const result = verifyEqualToPrevValue(meterReading, prevRecord, index, 'powerConsumptionCoef')
     expect(result).toBe('no update required')
   })
 
   test('when value is greater, update record with warning data', () => {
     meterReading.powerConsumptionCoef = {
       value: 500
     }
     const result = verifyEqualToPrevValue(meterReading, prevRecord, index, 'powerConsumptionCoef')
 
     if (result === 'no update required') {
       throw new Error('Function returned \'no update required\' when an update was required.')
     }
 
     expect(result.calculationMessage).toBeTruthy()
     expect(result.calculationState).toBeTruthy()
   })
 
   test('warning exists but is fixed - record returns to success state', () => {
     meterReading.powerConsumptionCoef = {
       value: 400,
       calculationState: 'warning',
       calculationMessage: 'Expected: 400'
     }
 
     const result = verifyEqualToPrevValue(meterReading, prevRecord, index, 'powerConsumptionCoef')
 
     if (result === 'no update required') {
       throw new Error('Function returned \'no update required\' when an update was required.')
     }

     expect(result.calculationState).toBe(undefined)
     expect(result.calculationMessage).toBe(undefined)
   })
 
 
 })