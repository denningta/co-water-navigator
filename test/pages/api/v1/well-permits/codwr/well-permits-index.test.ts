import { createMocks } from "node-mocks-http"
import { WellPermit } from "../../../../../../interfaces/WellPermit"
import fauna from "../../../../../../lib/fauna/faunaClientV10"
import deleteWellPermits from "../../../../../../lib/fauna/ts-queries/well-permits/deleteWellPermits"
import wellPermitsHandler from "../../../../../../pages/api/v1/well-permits/codwr"

describe('/api/v1/well-permits/codwr', () => {

  const wellPermits: WellPermit[] = [
    {
      permit: '12345-TE',
      contactName: 'Mike Backer',
      receipt: '3671274A'
    },
    {
      permit: '12345-TE',
      contactName: 'Jordan Timmreck',
      receipt: '3671274B'

    },
    {
      permit: '54321-ST',
      contactName: 'Cam Allen',
      receipt: '0361469'
    },
  ]

  beforeAll(async () => {
    await fauna.query(deleteWellPermits(wellPermits))
  })

  afterAll(() => {
    fauna.close()
  })


  test('create well permit', async () => {

    const { req, res }: any = createMocks({
      method: 'POST',
      body: wellPermits
    })

    try {
      const { data } = await wellPermitsHandler(req, res)

      expect(data).toHaveLength(2)
      expect(data[0].records).toHaveLength(1)

    } catch (error: any) {
      throw new Error(error)
    }
  })

})
