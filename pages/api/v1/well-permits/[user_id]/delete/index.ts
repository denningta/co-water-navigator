import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import { HttpError } from "../../../interfaces/HttpError";

type HandlerFunctions = { 
  [key: string]: (req: NextApiRequest, res: NextApiResponse) => Promise<any> 
};

async function deleteHandler(
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
  
  if (req.method === 'POST') {

  }

}

export default withApiAuthRequired(deleteHandler);

