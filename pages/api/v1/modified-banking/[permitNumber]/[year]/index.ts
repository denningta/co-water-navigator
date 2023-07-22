import { NextApiRequest, NextApiResponse } from "next";
import { ModifiedBanking } from "../../../../../../interfaces/ModifiedBanking";
import createModifiedBanking from "./create";
import deleteModifiedBanking from "./delete";
import listModifiedBanking from "./list";
import updateModifiedBanking from "./update";

type HandlerFunctions = {
  [key: string]: (req: NextApiRequest, res: NextApiResponse) => Promise<ModifiedBanking>
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {

    if (!req || !req.method) {
      throw new Error('Invalid request or request method')
    }

    const handlers: HandlerFunctions = {
      GET: listModifiedBanking,
      POST: createModifiedBanking,
      PATCH: updateModifiedBanking,
      DELETE: deleteModifiedBanking
    }

    const data = await handlers[req.method](req, res)
    res.status(200).json(data)
    return data

  } catch (error: any) {
    res.status(500).json(error)
    return error

  }

}

export default handler;
