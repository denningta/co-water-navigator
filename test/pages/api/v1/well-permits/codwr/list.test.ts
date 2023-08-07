import { listCodwrWellPermits } from "../../../../../../pages/api/v1/well-permits/codwr/list"

describe('listCodwrWellPermits', () => {

  it('returns WellPermits based on receipt numbers query', async () => {

    const receipts = [
      '0379338X',
      '0379338W'
    ]

    try {
      const response = await listCodwrWellPermits(receipts)

      expect(response.length).toEqual(2)
      response.forEach(el => {
        expect(el).toHaveProperty('permit')
        expect(el).toHaveProperty('receipt')
      })

    } catch (error: any) {
      throw new Error(error)
    }
  })


})
