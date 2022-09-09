import { NextApiRequest, NextApiResponse } from "next";
import { ModifiedBanking } from "../../../../../../interfaces/ModifiedBanking";
import { HttpError } from "../../../interfaces/HttpError";
import createModifiedBanking from "./create";
import deleteModifiedBanking from "./delete";
import listModifiedBanking from "./list";
import updateModifiedBanking from "./update";

type HandlerFunctions = { 
  [key: string]: (req: NextApiRequest) => Promise<ModifiedBanking> 
};

function handler(
  req: NextApiRequest, 
  res: NextApiResponse
): Promise<ModifiedBanking | HttpError> {
    if (!req || !req.method) {
      return Promise.reject(new HttpError(
        'No Request or Invalid Request Method',
        'No request or an invalid request method was sent to the server',
        400
      ));
    }
  
    const handlers: HandlerFunctions = {
      GET: listModifiedBanking,
      POST: createModifiedBanking,
      PATCH: updateModifiedBanking,
      DELETE: deleteModifiedBanking
    }
  
    return handlers[req.method](req)
      .then((response) => {
        res.status(200).json(response);
        return response
      })
      .catch((errors: any) => {
        res.status(errors[0].status || 500).json({errors: errors})
        return errors
      });
}

export default handler;