import MeterReading from "../../../../../../../interfaces/MeterReading"
import verifyAvailableThisYear from "../../../../../../../pages/api/v1/meter-readings/[permitNumber]/calculate/verify-availableThisYear"
import * as meterReadingData from './test-data.json'

const importData = meterReadingData as any
const data: MeterReading[] = importData.meterReadings

function generateRecord(index: number): MeterReading {
  return {
    permitNumber: data[index].permitNumber,
    date: data[index].date
  }
}


describe('verifyAvailaibleThisYear', () => {

  const pumpingLimitThisYear = 300

  test('user defined value', () => {
    const index = 7
    const currentRecord: MeterReading = {
      ...generateRecord(index),
      availableThisYear: {
        value: 520,
        source: 'user'
      }
    }
    const context = [
      currentRecord
    ]

    const result = verifyAvailableThisYear(currentRecord, pumpingLimitThisYear, context, index)
    expect(result).toMatchObject({ value: 520, source: 'user' })
  })


  describe('= pumpingLimitThisYear - pumpedYearToDate', () => {

    const index = 7
    const currentRecord: MeterReading = {
      ...generateRecord(index),
      pumpedYearToDate: {
        value: 100
      }
    }
    const context = [
      currentRecord
    ]
    test('dependencies are defined', () => {
      const result = verifyAvailableThisYear(currentRecord, pumpingLimitThisYear, context, index)
      expect(result).toMatchObject({ value: pumpingLimitThisYear - 100 })
    })

    test('dependencies are user-deleted', () => {
      currentRecord.pumpedYearToDate = {
        value: 'user-deleted',
        source: 'user-deleted'
      }

      const result = verifyAvailableThisYear(currentRecord, pumpingLimitThisYear, context, index)
      expect(result).toBeUndefined()

    })
  })

  describe('passes validation -> = pumpingLimitThisYear - sum of pumpedThisPeriod', () => {
    const index = 7
    const currentRecord = {
      ...generateRecord(index)
    }
    const context: MeterReading[] = [
      {
        ...generateRecord(index - 2),
        pumpedThisPeriod: {
          value: 50
        }
      },
      {
        ...generateRecord(index - 1),
        pumpedThisPeriod: {
          value: 50
        }
      },
      currentRecord
    ]

    test('dependencies are defined', () => {
      const result = verifyAvailableThisYear(currentRecord, pumpingLimitThisYear, context, index)
      expect(result).toMatchObject({ value: pumpingLimitThisYear - 100 })
    })

    test('dependencies are user-deleted', () => {
      const newContext: MeterReading[] = context.map(el => ({ ...el, pumpedThisPeriod: { value: 'user-deleted', source: 'user-deleted' } }))
      const result = verifyAvailableThisYear(currentRecord, pumpingLimitThisYear, newContext, index)
      expect(result).toBeUndefined()
    })
  })

  describe('= pumpingLimitThisYear - (currentFlowMeter - lastFlowMeterLastYear)', () => {
    const index = 7
    const currentRecord: MeterReading = {
      ...generateRecord(index),
      flowMeter: {
        value: 100
      }
    }

    const context: MeterReading[] = [
      {
        ...generateRecord(0),
        date: '2021-11',
        flowMeter: {
          value: 50
        }

      },
    ]

    test('dependencies are defined', () => {
      const result = verifyAvailableThisYear(currentRecord, pumpingLimitThisYear, context, index)
      expect(result).toMatchObject({ value: pumpingLimitThisYear - (100 - 50) })
    })

    test('dependencies are undefined', () => {
      currentRecord.flowMeter = {
        value: 'user-deleted',
        source: 'user-deleted'
      }
      const result = verifyAvailableThisYear(currentRecord, pumpingLimitThisYear, context, index)
      expect(result).toBeUndefined()
    })
  })

  describe('= prevAvailableThisYear - pumpedThisPeriod', () => {
    const index = 7
    const currentRecord: MeterReading = {
      ...generateRecord(index),
      pumpedThisPeriod: {
        value: 150
      }
    }
    const context: MeterReading[] = [
      {
        ...generateRecord(index - 2),
        availableThisYear: {
          value: 300
        }
      }
    ]


    test('dependencies are defined', () => {
      const result = verifyAvailableThisYear(currentRecord, pumpingLimitThisYear, context, index)
      expect(result).toMatchObject({ value: 300 - 150 })
    })

    test('dependencies are undefined', () => {
      delete context[0].availableThisYear
      delete currentRecord.pumpedThisPeriod
      const result = verifyAvailableThisYear(currentRecord, pumpingLimitThisYear, context, index)
      expect(result).toBeUndefined()
    })
  })




})


