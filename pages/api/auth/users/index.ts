import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { AppMetadata, Role, User, UserMetadata } from "auth0";
import { NextApiRequest, NextApiResponse } from "next";
import { UserManagement } from "../../../../interfaces/User";
import managementClient from "../../../../lib/auth0/auth0ManagementClient";

const getUserManagementData = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession(req, res)

  if (session && session.user && !session.user['coWaterExport/roles'].includes('admin'))
    throw new Error('Not authorized')

  try {
    const auth0 = managementClient

    const users: User<AppMetadata, UserMetadata>[] = (await auth0.getUsers())

    const userMngtData: UserManagement[] = await Promise.all(users.map(async (user) => {
      if (!user.user_id) return user
      const roles = await auth0.getUserRoles({ id: user.user_id})

      return {
        ...user,
        roles: roles
      }
    }))

    res.status(200).json(userMngtData)

  } catch (error: any) {
    res.status(500).json({ statusCode: 500, message: error.message })
  }


}

export default withApiAuthRequired(getUserManagementData)