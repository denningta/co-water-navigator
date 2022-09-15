import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import { ManagementClient } from "auth0"
import managementClient from "../../../../lib/auth0/auth0ManagementClient";

const getAppMetaData = async (req: NextApiRequest, res: NextApiResponse) => {

  try {

    const session = await getSession(req, res)
    const id = session?.user.sub

    res.status(200).json(session)

  } catch (error: any) {
    res.status(500).json({ statusCode: 500, message: error.message })
  }


}

export default withApiAuthRequired(getAppMetaData)