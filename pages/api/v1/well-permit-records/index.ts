import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import createWellPermitRecordsHandler from "./create";
import deleteWellPermitRecordsHandler from "./delete";
import listWellPermitRecordsHandler from "./list";
import updateWellPermitRecordsHandler from "./update";


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
    GET: listWellPermitRecordsHandler,
    POST: createWellPermitRecordsHandler,
    PATCH: updateWellPermitRecordsHandler,
    DELETE: deleteWellPermitRecordsHandler
  }

  try {
    const response = await handlers[req.method](req)
    res.status(200).json(response);

  } catch (error: any) {
    res.status(500).json(error)
  }

}

export default withApiAuthRequired(wellPermitRecordsHandler);

