import { QuerySuccess, QueryValue } from "fauna"
import fauna from "../../../../lib/fauna/faunaClientV10"
import getWellPermits, { WellPermitsQuery } from "../../../../lib/fauna/ts-queries/well-permits/getWellPermits"

describe('FQLX queries', () => {

  test('getWellPermits by id and permitNumber', async () => {
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

  test('getWellPermits by permitNumber', async () => {
    const query: WellPermitsQuery = {
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

  test('getWellPermits by id', async () => {
    const query: WellPermitsQuery = {
      ids: [
        '372101640243642967',
        '372115299605938775'
      ],
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
