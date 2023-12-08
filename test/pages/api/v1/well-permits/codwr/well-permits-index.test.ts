import { createMocks } from "node-mocks-http"
import { WellPermit } from "../../../../../../interfaces/WellPermit"
import fauna from "../../../../../../lib/fauna/faunaClientV10"
import { deleteWellPermitsById } from "../../../../../../lib/fauna/ts-queries/well-permits/deleteWellPermits"
import wellPermitsHandler from "../../../../../../pages/api/v1/well-permits/codwr"

describe('/api/v1/well-permits/codwr', () => {

  const wellPermits: WellPermit[] = [
    {
      id: '1001',
      permit: '12345-TE',
      contactName: 'Mike Backer',
      receipt: '3671274A'
    },
    {
      id: '1002',
      permit: '12345-TE',
      contactName: 'Jordan Timmreck',
      receipt: '3671274B'

    },
    {
      id: '1003',
      permit: '54321-ST',
      contactName: 'Cam Allen',
      receipt: '0361469'
    },
  ]

  const ids = wellPermits.map(el => el.id) as string[]


  beforeAll(async () => {
    await fauna.query(deleteWellPermitsById(ids))
  })

  afterAll(async () => {
    await fauna.query(deleteWellPermitsById(ids))
    fauna.close()
  })


  test('create well permit', async () => {
    const { req, res }: any = createMocks({
      method: 'POST',
      body: wellPermits
    })

    try {
      const response = await wellPermitsHandler(req, res)

      expect(response).toHaveLength(2)
      expect(response[0].records).toHaveLength(1)

    } catch (error: any) {
      throw new Error(error)
    }
  })

})
