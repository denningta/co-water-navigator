import { NextApiRequest } from "next"
import fauna from "../../../../../../lib/fauna/faunaClientV10"
import updateWellPermitByPermitNumber from "../../../../../../lib/fauna/ts-queries/well-permits/updateWellPermitByPermitNumber"

const updateWellPermitByPermitNumberHandler = async (req: NextApiRequest) => {

  const { permitNumber } = req.query
  const body = req.body

  if (!permitNumber) throw new Error('Invalid query parameters')
  if (!body) throw new Error('Body was missing from the request')

  if (Array.isArray(permitNumber)) throw new Error('This enpoint allows does not allow multiple permit updates in one request')

  try {

    const { data } = await fauna.query(updateWellPermitByPermitNumber(permitNumber, body))

    return data

  } catch (error: any) {
    throw new Error(error)
  }
}

export default updateWellPermitByPermitNumberHandler
