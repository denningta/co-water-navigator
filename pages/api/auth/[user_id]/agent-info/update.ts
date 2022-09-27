import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { Role } from "auth0";
import { NextApiRequest, NextApiResponse } from "next";
import managementClient from "../../../../../lib/auth0/auth0ManagementClient";
import faunaClient, { q } from "../../../../../lib/fauna/faunaClient";

const updateAgentInfo = (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const { user_id } = req.query

    if (!user_id)
      throw new Error('user_id query was not defined in the request')
    if (Array.isArray(user_id)) 
      throw new Error('Only a single user_id can be queried at a time from this endpoint')

    if (!req.body)
      throw new Error('No data was included in the body of this request')

    const response: any = await faunaClient.query(
      q.Let(
        {
          userRefs: q.Paginate(q.Match(q.Index('agent-info-by-user_id'), [user_id])),
          userExists: q.ContainsPath(['data', 0], q.Var('userRefs'))
        },
        q.If(
          q.Var('userExists'),
          q.Replace(
            q.Select(['data', 0], q.Var('userRefs')),
            { data: req.body }
          ),
          q.Create(
            q.Collection('agentInfo'),
            { data: req.body }
          )
        )
      )
    )
    .catch(error => reject(error))

    console.log(response)
  
  

    resolve(response)
  })

}

export default updateAgentInfo