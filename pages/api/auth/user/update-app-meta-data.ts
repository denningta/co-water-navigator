import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import { ManagementClient } from "auth0"
import managementClient from "../../../../lib/auth0/auth0ManagementClient";

const updateAppMetaData = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req

  const session = await getSession(req, res)
  const id = session?.user.sub

  try {
    const auth0 = managementClient

    await auth0.updateAppMetadata({ id: id }, body)

    res.status(200).json(body)

  } catch (error: any) {
    res.status(500).json({ statusCode: 500, message: error.message })
  }


}

export default withApiAuthRequired(updateAppMetaData)