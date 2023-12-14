import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import listDbb004BankingSummary from "./list";

import updateDbb004BankingSummary from "./update";

type HandlerFunctions = {
  [key: string]: (req: NextApiRequest) => Promise<any>
};

async function wellPermitRecordsHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (!req || !req.method) {
    throw new Error('No request or an invalid request method was sent to the server')
  }

  const handlers: HandlerFunctions = {
    GET: listDbb004BankingSummary,
    POST: updateDbb004BankingSummary
  }

  try {
    const response = await handlers[req.method](req)
    res.status(200).json(response);

  } catch (error: any) {
    res.status(500).send(error)
  }

}

export default withApiAuthRequired(wellPermitRecordsHandler);

