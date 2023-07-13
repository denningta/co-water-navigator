import MeterReading from '../interfaces/MeterReading'
import { calculate } from '../pages/api/v1/meter-readings/[permitNumber]/calculate'
import verifyPumpedThisPeriod from '../pages/api/v1/meter-readings/[permitNumber]/calculate/verify-pumpedThisPeriod'

const meterReadings: MeterReading[] = [


]

describe('Meter Readings - null or undefined values', () => {

  it('empty meterReadings array returns empty array', () => {
    const result = calculate([])
    expect(result).toEqual([])
  })

})

describe('Calculated Value', () => {
  const meterReadings = [
    {
      permitNumber: '14860-RFP',
      date: '2022-12',
      pumpedThisPeriod: { value: 10, source: 'user' },
      updatedBy: {
        name: 'Timothy Denning',
        user_id: 'google-oauth2|107076140906727245765'
      },
      flowMeter: undefined,
      powerMeter: undefined,
      powerConsumptionCoef: undefined
    }
  ]

  it('set \'source\' property to \'user\' when a value is set by the user', () => {

    const result = verifyPumpedThisPeriod(meterReadings[0], meterReadings, 0)
    console.log(result)


  })



})
