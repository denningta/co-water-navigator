import MeterReading, { CalculatedValue } from "../../../../../../../interfaces/MeterReading"
import { getPreviousValidCalculatedValues } from "../../../../../../../pages/api/v1/meter-readings/[permitNumber]/calculate/helpers"
import * as meterReadingData from './test-data.json'

const data = meterReadingData as any[]

describe('calculation helpers', () => {


  describe('getPreviousValidCalculatedValue', () => {

    test('get previous value that exists', () => {
      const context: MeterReading[] = data
      const meterReading = data[4]

      const prevValue = getPreviousValidCalculatedValues(meterReading, 4, context)

      expect(prevValue.prevFlowMeter).toMatchObject(context[3].flowMeter as CalculatedValue)
      expect(prevValue.prevPowerMeter).toMatchObject(context[3].powerMeter as CalculatedValue)

    })

    test('prev flow meter is user-deleted', () => {
      const context: MeterReading[] = [
        data[0],
        {
          ...data[1],
          flowMeter: {
            value: 'user-deleted',
            source: 'user-deleted'
          }
        },
        data[2]
      ]
      const meterReading = {
        ...data[2]
      }
      const prevValue = getPreviousValidCalculatedValues(meterReading, 2, context)

      expect(prevValue.prevFlowMeter).toMatchObject(context[0].flowMeter as CalculatedValue)
    })

    test('prev power meter is user-deleted', () => {
      const context: MeterReading[] = [
        data[0],
        {
          ...data[1],
          powerMeter: {
            value: 'user-deleted',
            source: 'user-deleted'
          }
        },
        data[2]
      ]
      const meterReading = {
        ...data[2]
      }
      const prevValue = getPreviousValidCalculatedValues(meterReading, 2, context)

      expect(prevValue.prevPowerMeter).toMatchObject(context[0].powerMeter as CalculatedValue)
    })
  })

})
