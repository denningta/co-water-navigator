import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import { HttpError } from "../../../api/v1/interfaces/HttpError"
import listRoles from "./list";

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
    GET: listRoles
  }

  return handlers[req.method](req, res)
  .then((response) => {
    res.status(200).json(response);
    return response;
  })
  .catch((errors) => {
    res.status(errors[0].status || 500).json({errors: errors})
    return errors;
  });

}

export default withApiAuthRequired(handler);

