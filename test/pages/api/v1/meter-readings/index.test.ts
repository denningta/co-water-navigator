import { Document } from "fauna"
import { createMocks } from "node-mocks-http"
import MeterReading from "../../../../../interfaces/MeterReading"
import fauna from "../../../../../lib/fauna/faunaClientV10"
import meterReadingsHandler from "../../../../../pages/api/v1/meter-readings"

describe('/api/v1/meter-readings', () => {

  const body: MeterReading[] = [
    {
      permitNumber: '12345-TEST',
      date: '2022-01',
      flowMeter: {
        value: 100
      }
    },
    {
      permitNumber: '12345-TEST',
      date: '2022-02',
      flowMeter: {
        value: 151
      }
    }
  ]

  let documents: Array<Document & MeterReading> = []

  beforeAll(async () => {
    const { req, res }: any = createMocks({
      method: 'POST',
      body: body
    })

    try {
      const response = await meterReadingsHandler(req, res)
      if (response) documents = response

      expect(response).toHaveLength(2)
      expect(response).toMatchObject(body)

    } catch (error: any) {
      throw new Error(error)
    }
  })

  afterAll(async () => {
    const { req, res }: any = createMocks({
      method: 'DELETE',
      body: documents.map(el => el.id)
    })

    try {
      const response = await meterReadingsHandler(req, res)
      fauna.close()

    } catch (error: any) {
      fauna.close()
      throw new Error(error)
    }
  })



  describe('listMeterReadings', () => {

    test('no query parameters returns an error', async () => {
      const { req, res }: any = createMocks({
        method: 'GET',
      })

      try {
        await expect(meterReadingsHandler(req, res)).rejects.toThrowError()

      } catch (error: any) {
      }

    })

    test('permitNumber query', async () => {
      const { req, res }: any = createMocks({
        method: 'GET',
        query: {
          permitNumber: '12345-TEST',
        }
      })

      try {
        const response = await meterReadingsHandler(req, res)
        expect(response).toMatchObject(body)

      } catch (error: any) {
        throw new Error(error)
      }
    })

    test('permitNumber and year query', async () => {
      const { req, res }: any = createMocks({
        method: 'GET',
        query: {
          permitNumber: '12345-TEST',
          year: '2022',
        }
      })

      try {
        const response = await meterReadingsHandler(req, res)
        expect(response).toMatchObject(body)

      } catch (error: any) {
        throw new Error(error)
      }
    })

    test('permitNumber and date query', async () => {
      const { req, res }: any = createMocks({
        method: 'GET',
        query: {
          permitNumber: '12345-TEST',
          date: ['2022-01', '2022-02']
        }
      })

      try {
        const response = await meterReadingsHandler(req, res)
        expect(response).toMatchObject(body)

      } catch (error: any) {
        throw new Error(error)
      }
    })
  })


})
