import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import { HttpError } from "../../interfaces/HttpError";
import handleListWellPemitsByUser from "./list";

type HandlerFunctions = {
  [key: string]: (req: NextApiRequest, res: NextApiResponse) => Promise<any>
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any | HttpError> {
  if (!req || !req.method) {
    return Promise.reject(new HttpError(
      'No Request or Invalid Request Method',
      'No request or an invalid request method was sent to the server',
      400
    ));
  }

  const handlers: HandlerFunctions = {
    GET: handleListWellPemitsByUser,
  }

  try {

    const response = await handlers[req.method](req, res)
    res.status(200).json(response)



  } catch (error: any) {
    res.status(error?.status || 500).json(error)
    throw new Error(error)
  }

}

export default withApiAuthRequired(handler);

