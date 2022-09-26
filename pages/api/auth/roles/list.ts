import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { Role } from "auth0";
import { NextApiRequest, NextApiResponse } from "next";
import managementClient from "../../../../lib/auth0/auth0ManagementClient";

const listRoles = async (req: NextApiRequest, res: NextApiResponse): Promise<Role[]> => {
  return new Promise(async (resolve, reject) => {
      const auth0 = managementClient
  
      const roles = await auth0.getRoles()
        .then(res => res)
        .catch(error => {
          reject(error)
          return error
        })
  
      resolve(roles)
  
  })

}

export default listRoles