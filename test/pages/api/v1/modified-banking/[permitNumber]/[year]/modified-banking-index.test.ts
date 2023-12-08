import { Document } from "fauna"
import { createMocks } from "node-mocks-http"
import { ModifiedBanking } from "../../../../../../../interfaces/ModifiedBanking"
import fauna from "../../../../../../../lib/fauna/faunaClientV10"
import { deleteModifiedBankingByRecords } from "../../../../../../../lib/fauna/ts-queries/modified-banking/deleteModifiedBanking"
import modifiedBankingHandler from "../../../../../../../pages/api/v1/modified-banking/[permitNumber]/[year]"
import { queryDependencies } from "../../../../../../../pages/api/v1/modified-banking/[permitNumber]/[year]/calculate"

describe('/api/v1/modified-banking/[permitNumber]/[year]', () => {

  const body: ModifiedBanking = {
    permitNumber: '4020-TEST',
    year: '2023',
    originalAppropriation: {
      value: 400
    },
    allowedAppropriation: {
      value: 290.92
    },
    bankingReserveLastYear: {
      value: 0
    },
    totalPumpedThisYear: {
      value: 400
    }
  }

  const update: ModifiedBanking = {
    ...body,
    totalPumpedThisYear: {
      value: 399,
      source: 'user'
    },
  }

  afterAll(() => {
    fauna.close()
  })

  test('create modifiedBanking', async () => {
    try {
      await fauna.query(deleteModifiedBankingByRecords([body]))
    } catch (error: any) {
      throw new Error(error)
    }

    const { req, res }: any = createMocks({
      method: 'POST',
      body: body,
      query: {
        permitNumber: body.permitNumber,
        year: body.year
      }
    })

    try {
      const response = await modifiedBankingHandler(req, res) as Document & ModifiedBanking
      expect(response).toMatchObject(body)

    } catch (error: any) {
      throw new Error(error)
    }
  })

  test('queryDependencies', async () => {

    try {

      const response = await queryDependencies('4020-TEST', '2023')

      expect(response).toMatchObject({
        dataLastYear: null,
        bankingReserveLastYear: null,
        totalPumpedThisYear: null
      })

    } catch (error: any) {
      throw new Error(error)
    }
  })

  test('list modifiedBanking', async () => {
    const { req, res }: any = createMocks({
      method: 'GET',
      body: body,
      query: {
        permitNumber: body.permitNumber,
        year: body.year
      }
    })

    try {
      const response = await modifiedBankingHandler(req, res) as Document & ModifiedBanking
      expect(response).toMatchObject(body)

    } catch (error: any) {
      throw new Error(error)
    }
  })

  test('update modifiedBanking', async () => {

    const { req, res }: any = createMocks({
      method: 'PATCH',
      body: update,
      query: {
        permitNumber: body.permitNumber,
        year: body.year
      }
    })

    try {
      const response = await modifiedBankingHandler(req, res) as Document & ModifiedBanking
      expect(response).toMatchObject(update)

    } catch (error: any) {
      throw new Error(error)
    }

  })


  test('delete modifiedBanking', async () => {
    const { req, res }: any = createMocks({
      method: 'DELETE',
      query: {
        permitNumber: body.permitNumber,
        year: body.year
      }
    })

    try {
      const response = await modifiedBankingHandler(req, res) as Document & ModifiedBanking
      expect(response).toBeNull()

    } catch (error: any) {
      throw new Error(error)
    }
  })

})
