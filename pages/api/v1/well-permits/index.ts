import { getAccessToken, getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextJwtVerifier } from "@serverless-jwt/next";
import { NextAuthenticatedApiRequest } from "@serverless-jwt/next/dist/types";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import MeterReading from "../../../../interfaces/MeterReading";
import { HttpError } from "../interfaces/HttpError";
import createWellPermits from "./create";
import listWellPermits from './list'


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
    GET: listWellPermits,
    POST: createWellPermits
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

