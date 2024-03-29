import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import listWellPermits from './list'


type HandlerFunctions = {
  [key: string]: (req: NextApiRequest, res: NextApiResponse) => Promise<any>
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (!req || !req.method) {
    throw new Error('No request or an invalid request method was sent to the server')
  }

  const handlers: HandlerFunctions = {
    GET: listWellPermits,
  }

  try {
    const response = await handlers[req.method](req, res)
    res.status(200).json(response);

  } catch (error: any) {
    res.status(500).json(error)
  }

}

export default withApiAuthRequired(handler);

