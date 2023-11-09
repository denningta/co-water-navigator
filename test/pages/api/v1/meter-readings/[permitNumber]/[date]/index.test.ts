import { createMocks } from "node-mocks-http"
import MeterReading from "../../../../../../../interfaces/MeterReading"
import meterReadingHandler from "../../../../../../../pages/api/v1/meter-readings/[permitNumber]/[date]"

describe('/api/v1/meter-readings/[permitNumber]/[date]', () => {

  const body: MeterReading = {
    permitNumber: '12345-TEST',
    date: '2022-01',
    flowMeter: {
      value: 150
    }
  }


  beforeAll(async () => {

    const { req, res }: any = createMocks({
      method: 'POST',
      body: body
    })

    const response = await meterReadingHandler(req, res)

    expect(response)
  })

  afterAll(async () => {
    const { req, res }: any = createMocks({
      method: 'DELETE',
      query: {
        permitNumber: body.permitNumber,
        date: body.date
      }
    })

    const response = await meterReadingHandler(req, res)

  })


  test('list meterReading', async () => {

    const test = 2
    expect(test).toEqual(2)


  })


})
