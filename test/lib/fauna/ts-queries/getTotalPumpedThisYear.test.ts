import MeterReading from "../../../../interfaces/MeterReading"
import faunaClient from "../../../../lib/fauna/faunaClient"
import createMeterReadings from "../../../../lib/fauna/ts-queries/createMeterReadings"
import deleteMeterReadings from "../../../../lib/fauna/ts-queries/deleteMeterReadings"
import getTotalPumpedThisYear from "../../../../lib/fauna/ts-queries/getTotalPumpedThisYear"

const meterReadings: MeterReading[] = [
  {
    permitNumber: 'test1',
    date: '1990-01',
    flowMeter: {
      value: 100
    },
  },
  {
    permitNumber: 'test1',
    date: '1990-02',
    flowMeter: {
      value: 200
    },
  },
  {
    permitNumber: 'test1',
    date: '1990-05',
    flowMeter: {
      value: 250
    },
  },
  {
    permitNumber: 'test1',
    date: '1990-11',
    flowMeter: {
      value: 400
    },
    pumpedYearToDate: {
      value: 300
    }
  },
  {
    permitNumber: 'test2',
    date: '1990-01',
    flowMeter: {
      value: 100
    }
  },
  {
    permitNumber: 'test2',
    date: '1990-12',
    flowMeter: {
      value: 500
    }
  },
  {
    permitNumber: 'test3',
    date: '1990-01',
    pumpedThisPeriod: {
      value: 10
    }
  },
  {
    permitNumber: 'test3',
    date: '1990-03',
    pumpedThisPeriod: {
      value: 10
    }
  },
  {
    permitNumber: 'test3',
    date: '1990-11',
    pumpedThisPeriod: {
      value: 20
    }
  },
]

describe('Fauna Queries', () => {

  beforeAll(async () => {
    try {
      const res = await faunaClient.query(createMeterReadings(meterReadings))
    } catch (error) {
      throw new Error('Test setup failed')
    }
  })

  afterAll(async () => {
    try {
      const res = await faunaClient.query(deleteMeterReadings(meterReadings))
    } catch (error) {
      throw new Error('Test teardown failed')
    }
  })


  describe('getTotalPumpedThisYear', () => {

    it('calculates total based on Sum(pumpedThisPeriod)', async () => {
      try {
        const totalPumpedThisYear = await faunaClient.query(getTotalPumpedThisYear('test3', '1990'))
        expect(totalPumpedThisYear).toEqual(40)
      } catch (error: any) {
        console.log(error)
        throw new Error('Something went wrong')
      }
    })

    it('calculates total based on Max(pumpedYearToDate) value', async () => {
      const totalPumpedThisYear = await faunaClient.query(getTotalPumpedThisYear('test1', '1990'))
      expect(totalPumpedThisYear).toEqual(300)
    })

  })


})
