import { WellPermit, WellPermitDocument } from "../../../../../interfaces/WellPermit"
import createWellPermitRecordsQuery from "../../../../../lib/fauna/ts-queries/well-permit-records/createWellPermitRecordsQuery"
import deleteWellPermitRecordsQuery from "../../../../../lib/fauna/ts-queries/well-permit-records/deleteWellPermitRecordsQuery"
import getWellPermitRecordsByPermitNumber from "../../../../../lib/fauna/ts-queries/well-permit-records/getWellPermitRecordsQuery"
import faunaClientV10 from "../../../../../lib/fauna/faunaClientV10"
import { Page, QuerySuccess, QueryValue } from "fauna"
import updateWellPermitRecordsQuery from "../../../../../lib/fauna/ts-queries/well-permit-records/updateWellPermitRecordsQuery"


describe('fauna queries -> well-permit-records', () => {

  const wellPermits: WellPermit[] = [
    {
      permit: '12345-FP',
      contactName: 'Steve Schiesser'
    },
    {
      permit: '56789-AB',
      contactName: 'Cam Allen'
    }
  ]

  let documents: WellPermitDocument[] = []

  beforeAll(async () => {
    try {
      const { data } = await faunaClientV10.query<(WellPermitDocument)[]>(createWellPermitRecordsQuery(wellPermits))
      documents = data

      expect(data).toHaveLength(2)

      data.forEach(el => {
        expect(el).toHaveProperty('permit')
        expect(el).toHaveProperty('contactName')
      })

    } catch (error: any) {
      throw new Error('test setup failed')
    }
  })

  afterAll(async () => {
    try {
      await faunaClientV10.query(
        deleteWellPermitRecordsQuery(documents.map(el => el.id) as string[])
      )

      faunaClientV10.close()

    } catch (error: any) {
      throw new Error('test teardown failed')
    }
  })


  test('getWellPermitRecords -> return well permit records given permit numbers', async () => {

    try {
      const { data }: QuerySuccess<Page<QueryValue & WellPermit[]>> = await faunaClientV10.query(
        getWellPermitRecordsByPermitNumber(['12345-FP', '56789-AB'])
      )

      expect(data.data).toHaveLength(2)

    } catch (error: any) {
      throw new Error(error)
    }
  })


  test('updateWellPermitRecordsQuery -> update well permit and return updated record', async () => {
    const updatedWellPermits: WellPermitDocument[] = [
      {
        ...documents[1],
        contactName: 'Mike Backer',
      }
    ]

    try {
      const { data } = await faunaClientV10.query<WellPermitDocument[]>(
        updateWellPermitRecordsQuery(updatedWellPermits)
      )

      if (!data) throw new Error('No data returned')

      expect(data).toHaveLength(1)


      data.forEach((el) => {
        expect(el).toHaveProperty('permit')
        expect(el).toHaveProperty('contactName')
        expect(el.contactName).toBe('Mike Backer')
      })

    } catch (error: any) {
      throw new Error(error)
    }

  })







})
