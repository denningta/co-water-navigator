import { fql, QuerySuccess, QueryValue } from "fauna"
import fauna from "../../../../../lib/fauna/faunaClientV10"
import getMeterReadings from "../../../../../lib/fauna/ts-queries/meter-readings/getMeterReadings"

describe('fauna v10 -> getMeterReadings', () => {

  test('getMeterReadings', async () => {

    try {

      const { data }: QuerySuccess<QueryValue[]> = await fauna.query(
        getMeterReadings({
          permitNumbers: ['31643-FP'],
          years: ['2022', '2023']
        })
      )

      console.table(data.map((el: any) => ({ date: el.date })))


    } catch (error: any) {
      console.log(error)
      throw new Error(error)

    }


  })


})
