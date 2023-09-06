import { QuerySuccess, QueryValue } from "fauna"
import { createMocks } from "node-mocks-http"
import listWellPemitsHandler from "../../../../../pages/api/v1/well-permits/list"

describe('/api/v1/well-permits/', () => {


  describe('listWellPermits', () => {

    test('returns wellPermit records given document ids', async () => {

      const ids = [
        '372101640243642967',
        '372115299605938775'
      ]

      const { req }: any = createMocks({
        method: 'GET',
        query: {
          ids: ids
        }
      })

      try {

        const { data }: QuerySuccess<QueryValue[]> = await listWellPemitsHandler(req)

        if (!data) throw new Error('response is undefined')

        expect(data).toHaveLength(2)


        data.forEach(record => {
          expect(record).toHaveProperty('permit')
          expect(record).toHaveProperty('records')
        })

      } catch (error: any) {
        throw new Error(error)
      }
    })

  })


})
