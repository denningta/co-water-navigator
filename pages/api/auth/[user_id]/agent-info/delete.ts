import { NextApiRequest, NextApiResponse } from "next";
import fauna from "../../../../../lib/fauna/faunaClientV10";
import deleteAgentInfoQuery from '../../../../../lib/fauna/ts-queries/agent-info/deleteAgentInfo'

const deleteAgentInfo = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {

  const { user_id, permitNumber } = req.query
  if (!user_id)
    throw new Error('user_id query was not defined in the request')
  if (Array.isArray(user_id))
    throw new Error('Only a single user_id can be queried at a time from this endpoint')
  if (!permitNumber)
    throw new Error('permitNumber was not defined in the request')
  if (Array.isArray(permitNumber))
    throw new Error('Only a single permitNumber can be queried at this endpoing')

  try {
    const { data } = await fauna.query(deleteAgentInfoQuery(user_id, permitNumber))
    return data

  } catch (error: any) {
    throw new Error(error)
  }


}

export default deleteAgentInfo
