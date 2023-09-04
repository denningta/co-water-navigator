import { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http"
import { WellPermitDocument } from "../../../../../interfaces/WellPermit";
import fauna from "../../../../../lib/fauna/faunaClientV10";
import createWellPermitRecordsHandler from "../../../../../pages/api/v1/well-permit-records/create";
import deleteWellPermitRecordsHandler from "../../../../../pages/api/v1/well-permit-records/delete";
import listWellPermitRecordsHandler from "../../../../../pages/api/v1/well-permit-records/list";
import updateWellPermitRecordsHandler from "../../../../../pages/api/v1/well-permit-records/update";

describe('/api/v1/well-permit-records', () => {

  let documents: WellPermitDocument[] = []

  beforeAll(async () => {

    const { req }: any = createMocks({
      method: 'POST',
      body: [
        {
          permit: '12345-FP',
          contactName: 'Cam Allen'
        },
        {
          permit: '56789-AB',
          contactName: 'Steve Schiesser'
        }
      ]
    })

    try {
      const response = await createWellPermitRecordsHandler(req)

      documents = response as any

      expect(response).toHaveLength(2)

      debugger

    } catch (error: any) {
      throw new Error(error)
    }



  })

  afterAll(async () => {
    const { req }: any = createMocks({
      method: 'DELETE',
      body: documents.map(el => el.id)
    })

    try {
      const response = await deleteWellPermitRecordsHandler(req)

      expect(response).toHaveLength(2)

      fauna.close()

    } catch (error: any) {
      fauna.close()
      throw new Error(error)
    }

  })


  test('get well permit records', async () => {
    const { req } = createMocks({
      method: 'GET',
      query: {
        permitNumber: ['12345-FP', '565789-AB'],
      },
    });

    try {
      const response = await listWellPermitRecordsHandler(req as any)

      expect(response).toHaveLength(2)


    } catch (error: any) {
      throw new Error(error)
    }
  })

  test('update well permit records', async () => {
    const { req }: any = createMocks({
      method: 'PATCH',
      body: [
        {
          ...documents[0],
          contactName: 'Mike Backer'
        }
      ]
    })


    try {
      const response = await updateWellPermitRecordsHandler(req)

      expect(response).toHaveLength(1)

    } catch (error: any) {
      throw new Error(error)
    }

  })


})
