import { Page, QuerySuccess, QueryValue } from "fauna";
import { NextApiRequest } from "next";
import fauna from "../../../../lib/fauna/faunaClientV10";
import getWellPermitRecordsByPermitNumber from "../../../../lib/fauna/ts-queries/well-permit-records/getWellPermitRecordsQuery";

const listWellPermitRecordsHandler = (req: NextApiRequest) => {
  const { permitNumber } = req.query

  if (!permitNumber) throw new Error('Invalid query')

  return listWellPermitRecordsByPermitNumber([...permitNumber])
}

export const listWellPermitRecordsByPermitNumber = async (permitNumbers: string[]) => {
  try {
    const { data }: QuerySuccess<Page<QueryValue[]>> = await fauna.query(getWellPermitRecordsByPermitNumber(permitNumbers))

    return data.data



  } catch (error: any) {
    console.log(error)
    throw new Error(error)
  }

}

export default listWellPermitRecordsHandler
