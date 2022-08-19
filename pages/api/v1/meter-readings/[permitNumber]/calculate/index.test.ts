/**
 * Tests meterReadings calculations
 * 
 * @group meter-readings
 * @group calculations
 */

import { runCalculations } from "."
import MeterReading from "../../../../../../interfaces/MeterReading"

describe('DBB-004 calculations', () => {
  let meterReadings: MeterReading[] = [
    {
      permitNumber: 'XX-00002',
      date: '1900-02',
      flowMeter: { value: 120 },
      powerMeter: { value: 620 },
      powerConsumptionCoef: { value: 800 }
    },
    {
      permitNumber: 'XX-00002',
      date: '1900-06',
      flowMeter: { value: 150 },
      powerMeter: { value: 700 },
      powerConsumptionCoef: { value: 800 }
    },
    {
      permitNumber: 'XX-00002',
      date: '1900-07',
      flowMeter: { value: 160 },
      powerMeter: { value: 710 },
      powerConsumptionCoef: { value: 800 }
    },
  ]
  let pumpingLimitThisYear: number;
  let result: MeterReading[]

  describe('initial value for calculated fields from flowMeter data', () => {
    beforeAll(() => {
      result = runCalculations(meterReadings)
    })
  
    test('calculate pumpedThisPeriod', () => {
      expect(result[1].pumpedThisPeriod).toBeTruthy()
      expect(result[1].pumpedThisPeriod?.value).toBe(30)
      expect(result[2].pumpedThisPeriod).toBeTruthy()
      expect(result[2].pumpedThisPeriod?.value).toBe(10)
    })
  
    test('calculate pumpedYearToDate', () => {
      expect(result[1].pumpedYearToDate).toBeTruthy()
      expect(result[1].pumpedYearToDate?.value).toBe(30)
      expect(result[2].pumpedYearToDate).toBeTruthy()
      expect(result[2].pumpedYearToDate?.value).toBe(40)
    })
  
    test('calculate availableThisYear', () => {
      expect(result[1].availableThisYear).toBeTruthy()
      // expect(result[1].availableThisYear?.value).toBe(30)
      expect(result[2].availableThisYear).toBeTruthy()
      // expect(result[2].availableThisYear?.value).toBe(40)
    })
  })

})