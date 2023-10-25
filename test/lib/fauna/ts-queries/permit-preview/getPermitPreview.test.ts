import { QuerySuccess, QueryValue } from "fauna"
import fauna from "../../../../../lib/fauna/faunaClientV10"
import getPermitPreview from "../../../../../lib/fauna/ts-queries/permit-preview/getPermitReview"

describe('FQLX -> getPermitPreview', () => {

  test('getPermitPreview', async () => {

    try {

      const { data }: QuerySuccess<QueryValue[]> = await fauna.query(
        getPermitPreview([
          '350046946838184524',
        ])
      )



    } catch (error: any) {
      console.log(error)
      throw new Error(error)

    }


  })

})


