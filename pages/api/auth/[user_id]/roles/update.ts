import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { Role } from "auth0";
import { NextApiRequest, NextApiResponse } from "next";
import managementClient from "../../../../../lib/auth0/auth0ManagementClient";

const updateUserRoles = async (req: NextApiRequest, res: NextApiResponse): Promise<Role[]> => {
  return new Promise(async (resolve, reject) => {

    const { user_id } = req.query
    if (!user_id)
      throw new Error('user_id query was not defined in the request')
    if (Array.isArray(user_id)) 
      throw new Error('Only a single user_id can be queried at a time from this endpoint')

    if (!req.body)
      throw new Error('No roles data was included in the body of this request')

    const auth0 = managementClient
  
    const roles = await auth0.assignRolestoUser({ id: user_id }, req.body)
      .then(res => res)
      .catch(error => {
        reject(error)
        return error
      })

    resolve(roles)
  })

}

export default updateUserRoles