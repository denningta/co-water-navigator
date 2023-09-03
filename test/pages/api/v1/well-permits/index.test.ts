import { WellPermit } from "../../../../../interfaces/WellPermit"
import { listWellPermits } from "../../../../../pages/api/v1/well-permits/list"

describe('/api/v1/well-permits/', () => {


  describe('listWellPermits', () => {

    test('returns wellPermit records given document_ids', async () => {

      const document_ids = [
        '350046946838184524',
        '350046946838185548'
      ]

      try {
        const response = await listWellPermits({
          document_ids: document_ids
        })

        if (!response) throw new Error('response is undefined')

        response.forEach(record => {
          expect(record).toHaveProperty('permit')
          expect(record).toHaveProperty('records')
        })

      } catch (error: any) {
        throw new Error(error)
      }
    })

    test('returns wellPermit records given permitNumbers', async () => {
      const permitNumbers = [
        '31643-FP',
        '14860-RFP',
      ]

      try {
        const response = await listWellPermits({
          permitNumbers: permitNumbers
        })

        if (!response) throw new Error('response is undefined')

        response.forEach(record => {
          expect(record).toHaveProperty('permit')
          expect(record).toHaveProperty('records')
        })

      } catch (error: any) {
        throw new Error(error)

      }
    })
  })


})
