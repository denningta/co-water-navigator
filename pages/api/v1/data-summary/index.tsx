import { NextApiRequest, NextApiResponse } from "next";
import MeterReading from "../../../../interfaces/MeterReading";
import { HttpError } from "../interfaces/HttpError";
import listDataSummary from "./list";

type HandlerFunctions = { 
  [key: string]: (req: NextApiRequest) => Promise<MeterReading[]> 
};

function handler(
  req: NextApiRequest, 
  res: NextApiResponse
): Promise<any[] | HttpError> {

    if (!req || !req.method) {
      return Promise.reject(new HttpError(
        'No Request or Invalid Request Method',
        'No request or an invalid request method was sent to the server',
        400
      ));
    }
  
    const handlers: HandlerFunctions = {
      GET: listDataSummary
    }

    return handlers[req.method](req)
    .then((response) => {
      res.status(200).json(response);
      return response;
    })
    .catch((error) => {
      res.status(error.status || 500).json({error: error})
      return error;
    });

}

export default handler;
