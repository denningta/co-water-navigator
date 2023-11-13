import { createMocks } from "node-mocks-http"
import MeterReading from "../../../../../../../interfaces/MeterReading"
import fauna from "../../../../../../../lib/fauna/faunaClientV10"
import { deleteMeterReadingsByRecord } from "../../../../../../../lib/fauna/ts-queries/meter-readings/deleteMeterReadings"
import meterReadingHandler, { MeterReadingResponse } from "../../../../../../../pages/api/v1/meter-readings/[permitNumber]/[date]"

describe('/api/v1/meter-readings/[permitNumber]/[date]', () => {

  const body: MeterReading = {
    permitNumber: '56789-TEST',
    date: '2022-01',
    flowMeter: {
      value: 150
    }
  }

  test('create meterReading', async () => {
    await fauna.query(deleteMeterReadingsByRecord([body]))

    const { req, res }: any = createMocks({
      method: 'POST',
      body: body,
      query: {
        permitNumber: body.permitNumber,
        date: body.date
      }
    })

    try {
      const response = await meterReadingHandler(req, res) as MeterReadingResponse[]
      expect(response[0]).toMatchObject(body)

    } catch (error: any) {
      throw new Error(error)
    }

  })



  test('list meter reading', async () => {
    const { req, res }: any = createMocks({
      method: 'GET',
      query: {
        permitNumber: body.permitNumber,
        date: body.date
      }
    })

    const response = await meterReadingHandler(req, res)
    expect(response).toMatchObject(body)

    const test = 2
    expect(test).toEqual(2)
  })

  test('update meter reading', async () => {
    const update = {
      ...body,
      flowMeter: {
        value: 200
      }
    }
    const { req, res }: any = createMocks({
      method: 'PATCH',
      query: {
        permitNumber: body.permitNumber,
        date: body.date
      },
      body: update
    })


    const response = await meterReadingHandler(req, res) as MeterReadingResponse[]
    expect(response[0]).toMatchObject(update)
  })

  test('delete meter readings', async () => {
    const { req, res }: any = createMocks({
      method: 'DELETE',
      query: {
        permitNumber: body.permitNumber,
        date: body.date
      }
    })

    try {
      await meterReadingHandler(req, res)
      fauna.close()

    } catch (error: any) {
      fauna.close()
      throw new Error(error)
    }
  })

})
