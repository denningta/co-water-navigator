import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import createWellPermits from "./create";
import listCodwrWellPermits from "./list";

type HandlerFunctions = {
  [key: string]: (req: NextApiRequest) => Promise<any>
};

async function wellPermitsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req || !req.method) {
    throw new Error('No request or an invalid request method was sent to the server')
  }

  const handlers: HandlerFunctions = {
    GET: listCodwrWellPermits,
    POST: createWellPermits
  }

  try {
    const response = await handlers[req.method](req)
    res.status(200).json(response);
    return response

  } catch (error: any) {
    res.status(500).send(error)
    throw new Error(error)
  }

}

export default wellPermitsHandler;

