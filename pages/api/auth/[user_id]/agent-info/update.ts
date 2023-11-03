import { NextApiRequest, NextApiResponse } from "next";
import fauna from "../../../../../lib/fauna/faunaClientV10";
import upsertAgentInfo from "../../../../../lib/fauna/ts-queries/agent-info/upsertAgentInfo";

const updateAgentInfo = async (req: NextApiRequest, res: NextApiResponse) => {
  const { user_id, permitNumber } = req.query
  const { body } = req

  if (!user_id)
    throw new Error('user_id query was not defined in the request')
  if (Array.isArray(user_id))
    throw new Error('Only a single user_id can be queried at a time from this endpoint')
  if (Array.isArray(permitNumber))
    throw new Error('Only a single permitNumber can be queried at a time from this endpoint')


  if (!body)
    throw new Error('No data was included in the body of this request')

  try {
    const { data } = await fauna.query(upsertAgentInfo(body, user_id, permitNumber))
    return data

  } catch (error: any) {
    debugger
    throw new Error(error)
  }
}

export default updateAgentInfo
