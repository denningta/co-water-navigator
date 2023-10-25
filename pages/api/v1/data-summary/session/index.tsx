import { getSession } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import { DataSummary } from "../../../../../hooks/useDataSummaryByPermit";
import listDataSummaryBySession from "./list"

type HandlerFunctions = {
  [key: string]: (req: NextApiRequest, res: NextApiResponse) => Promise<DataSummary[]>
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<DataSummary[]> {

  if (!req || !req.method) throw new Error('Invalid request')

  const handlers: HandlerFunctions = {
    GET: listDataSummaryBySession
  }

  try {
    const response = await handlers[req.method](req, res)
    res.status(200).json(response);
    return response
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error })
    return error
  }
}

export default handler;
