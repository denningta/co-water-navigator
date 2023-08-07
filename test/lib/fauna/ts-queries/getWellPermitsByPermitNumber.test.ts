import faunaClient from "../../../../lib/fauna/faunaClient"
import { getWellPermitsByPermitNumber } from "../../../../lib/fauna/ts-queries/getWellPermitByPermitNumber"

const testPermit =
{
  "permit": "9630-FP",
  "records": [
    {
      "@ref": {
        "id": "372131183497052760",
        "collection": {
          "@ref": {
            "id": "wellPermitRecords",
            "collection": {
              "@ref": {
                "id": "collections"
              }
            }
          }
        }
      }
    },
    {
      "@ref": {
        "id": "372130170553762391",
        "collection": {
          "@ref": {
            "id": "wellPermitRecords",
            "collection": {
              "@ref": {
                "id": "collections"
              }
            }
          }
        }
      }
    }
  ]
}

describe('getWellPermitsByPermitNumber', () => {
  beforeAll(() => {

  })

  afterAll(() => {

  })

  it('return permit record on successful creation', () => {
    try {

    } catch (error: any) {
      throw new Error(error)
    }
  })

  it('returns permit record given permit number', async () => {
    try {
      const response = await faunaClient.query(getWellPermitsByPermitNumber('9630-FP'))
      debugger
      console.log(response)
    } catch (error: any) {
      throw new Error(error)
    }
  })

  it('this test runs third', () => {
    console.log('third test')

  })

})
