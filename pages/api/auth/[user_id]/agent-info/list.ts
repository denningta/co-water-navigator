import { NextApiRequest, NextApiResponse } from "next";
import fauna from "../../../../../lib/fauna/faunaClientV10";
import getAgentInfo from "../../../../../lib/fauna/ts-queries/agent-info/getAgentInfo";

const listAgentInfo = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {

  const {
    user_id,
    permitNumber = 'global'
  } = req.query

  if (!user_id)
    throw new Error('user_id query was not defined in the request')
  if (Array.isArray(user_id))
    throw new Error('Only a single user_id can be queried at a time from this endpoint')
  if (Array.isArray(permitNumber))
    throw new Error('Only a single permitNumber can be queried at a time from this endpoint')


  try {
    const { data } = await fauna.query(getAgentInfo(user_id, permitNumber))
    return data

  } catch (error: any) {
    throw new Error(error)
  }



}

export default listAgentInfo
