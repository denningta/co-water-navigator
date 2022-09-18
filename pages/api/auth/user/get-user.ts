import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0"
import { NextApiRequest, NextApiResponse } from "next"
import managementClient from "../../../../lib/auth0/auth0ManagementClient"

const getUserHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = getSession(req, res)

  const { id } = Array.isArray(req.query) ? req.query[0] : req.query

  if (session && session.user && !session.user['coWaterExport/roles'].includes('admin'))
    throw new Error('Not authorized')

  try {
    const auth0 = managementClient
    const user = await auth0.getUser({ id: id })
    if (!user || !user.user_id) throw new Error('User not found')
    const roles = await auth0.getUserRoles({ id: user.user_id})


    res.status(200).json({ ...user, roles: roles })
  } catch (error: any) {
    res.status(500).json({ statusCode: 500, message: error.message })
  }

}

export default withApiAuthRequired(getUserHandler)