import { NextApiRequest } from "next";
import fauna from "../../../../../../lib/fauna/faunaClientV10";
import getWellPermitByPermitNumber from "../../../../../../lib/fauna/ts-queries/well-permits/getWellPermitByPermitNumber";

const listWellPermitByPermitNumber = async (req: NextApiRequest) => {
  const { permitNumber } = req.query
  if (!permitNumber) throw new Error('Invalid query: permitNumber missing')
  if (Array.isArray(permitNumber)) throw new Error('Only a single permitNumber can be queried at this end point')

  try {
    const { data } = await fauna.query(getWellPermitByPermitNumber(permitNumber))

    return data

  } catch (error: any) {
    throw new Error(error)
  }

}

export default listWellPermitByPermitNumber
