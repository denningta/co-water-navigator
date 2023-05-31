import { NextApiRequest, NextApiResponse } from "next";
import managementClient from "../../../../../lib/auth0/auth0ManagementClient";

type HandlerFunctions = {
  [key: string]: (req: NextApiRequest, ...args: any) => Promise<any>
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any> {

  if (!req || !req.method) throw new Error('Invalid request')

  const { user_id } = Array.isArray(req.query) ? req.query[0] : req.query

  const handlers: HandlerFunctions = {
    DELETE: deleteUser
  }

  try {
    const response = await handlers[req.method](req, user_id)
    res.status(200).json(response)
  } catch (error: any) {
    res.status(error.status ?? 500).json(error)
  }
}

export const deleteUser = async (req: NextApiRequest, user_id: string) => {

  try {
    const auth0 = managementClient
    const res = await auth0.deleteUser({ id: user_id })
    return res
  } catch (error: any) {
    return error
  }


}

export default handler;

