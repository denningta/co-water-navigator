import { Document, Page } from "fauna";
import { NextApiRequest } from "next";
import { WellPermit } from "../../../../interfaces/WellPermit";
import fauna from "../../../../lib/fauna/faunaClientV10";
import getWellPermitRecordsByPermitNumber from "../../../../lib/fauna/ts-queries/well-permit-records/getWellPermitRecordsQuery";

const listWellPermitRecordsHandler = (req: NextApiRequest) => {
  const { permitNumber } = req.query

  if (!permitNumber) throw new Error('Invalid query')

  return listWellPermitRecordsByPermitNumber(
    Array.isArray(permitNumber)
      ? permitNumber
      : [permitNumber]
  )
}

export const listWellPermitRecordsByPermitNumber = async (permitNumbers: string[]) => {
  try {
    const { data } = await fauna.query<Page<Document & WellPermit>>(getWellPermitRecordsByPermitNumber(permitNumbers))

    return data.data

  } catch (error: any) {
    throw new Error(error)
  }
}

export default listWellPermitRecordsHandler
