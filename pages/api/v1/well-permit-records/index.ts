import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";


type HandlerFunctions = {
  [key: string]: (req: NextApiRequest) => Promise<any>
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (!req || !req.method) {
    throw new Error('No request or an invalid request method was sent to the server')
  }

  const handlers: HandlerFunctions = {
    GET: listWellPermitRecords,
    POST: createWellPermitRecords,
    PATCH: updateWellPermitRecords
  }

  try {
    const response = await handlers[req.method](req)
    res.status(200).json(response);

  } catch (error: any) {
    res.status(500).json(error)
  }

}

export default withApiAuthRequired(handler);

