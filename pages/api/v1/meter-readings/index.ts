import { NextApiRequest, NextApiResponse } from "next";
import MeterReading from "../../../../interfaces/MeterReading";
import { HttpError } from "../interfaces/HttpError";
import createMeterReadings from "./create";
import listMeterReadings from "./list";

type HandlerFunctions = { 
  [key: string]: (req: NextApiRequest) => Promise<MeterReading[]> 
};

function handler(
  req: NextApiRequest, 
  res: NextApiResponse
): Promise<MeterReading[] | HttpError> {

    if (!req || !req.method) {
      return Promise.reject(new HttpError(
        'No Request or Invalid Request Method',
        'No request or an invalid request method was sent to the server',
        400
      ));
    }
  
    const handlers: HandlerFunctions = {
      GET: listMeterReadings,
      POST: createMeterReadings,
    }

    return handlers[req.method](req)
    .then((response) => {
      res.status(200).json(response);
      return response;
    })
    .catch((errors) => {
      res.status(errors[0].status || 500).json({errors: errors})
      return errors;
    });

}

export default handler;
