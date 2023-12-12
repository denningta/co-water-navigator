import { NextApiRequest, NextApiResponse } from "next";
import { ModifiedBanking } from "../../../../interfaces/ModifiedBanking";
import { HttpError } from "../interfaces/HttpError";
import listAdministrativeReports from "./list";


type HandlerFunctions = {
  [key: string]: (req: NextApiRequest) => Promise<ModifiedBanking[]>
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<ModifiedBanking[]> {

  if (!req || !req.method) {
    return Promise.reject(new HttpError(
      'No Request or Invalid Request Method',
      'No request or an invalid request method was sent to the server',
      400
    ));
  }

  const handlers: HandlerFunctions = {
    GET: listAdministrativeReports,
  }

  return handlers[req.method](req)
    .then((response) => {
      res.status(200).json(response);
      return response;
    })
    .catch((errors) => {
      res.status(errors[0].status || 500).json({ errors: errors })
      return errors;
    });

}

export default handler;

