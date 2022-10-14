import { NextApiRequest, NextApiResponse } from "next";
import { WellUsage } from "../../../../interfaces/ModifiedBanking";
import getWellUsage from "./list";
import upsertWellUsage from "./upsert";


type HandlerFunctions = { 
  [key: string]: (req: NextApiRequest) => Promise<WellUsage> 
};

async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  try {
    if (!req || !req.method) {
      throw new Error('No request or an invalid request method was sent to the server')
    }
      
    const handlers: HandlerFunctions = {
      GET: getWellUsage,
      POST: upsertWellUsage
    }
  
    const response = await handlers[req.method](req)

    res.status(200).json(response)

  } catch (error: any) {
    res.status(error?.status || 500).json(error)
  }

}

export default handler;