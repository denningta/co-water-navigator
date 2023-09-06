import { QuerySuccess, QueryValue } from "fauna"
import fauna from "../../../../lib/fauna/faunaClientV10"
import getWellPermits, { WellPermitsQuery } from "../../../../lib/fauna/ts-queries/well-permits/getWellPermits"

describe('fauna queries', () => {

  test('FQLX -> getWellPermits', async () => {
    const query: WellPermitsQuery = {
      ids: [
        '372101640243642967',
        '372115299605938775'
      ],
      permitNumbers: [
        '31642-FP',
        '95207-VE'
      ]
    }

    try {
      const { data }: QuerySuccess<QueryValue[]> = await fauna.query(getWellPermits(query))

      expect(data).toHaveLength(2)
      expect(data[0]).toHaveProperty('permit')
      expect(data[0]).toHaveProperty('id')

    } catch (error: any) {
      throw new Error(error)
    }
  })

})
