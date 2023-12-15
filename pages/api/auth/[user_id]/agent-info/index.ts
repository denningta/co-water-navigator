import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import { HttpError } from "../../../v1/interfaces/HttpError"
import deleteAgentInfo from "./delete";
import listAgentInfo from "./list";
import updateAgentInfo from "./update";

type HandlerFunctions = {
  [key: string]: (req: NextApiRequest, res: NextApiResponse) => Promise<any>
};

async function agentInfoHandler(
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
    GET: listAgentInfo,
    POST: updateAgentInfo,
    DELETE: deleteAgentInfo
  }

  return handlers[req.method](req, res)
    .then((response) => {
      res.status(200).json(response);
      return response;
    })
    .catch((error) => {
      res.status(500).send({ error: error })
      throw new Error(error)
    });

}

export default withApiAuthRequired(agentInfoHandler);

