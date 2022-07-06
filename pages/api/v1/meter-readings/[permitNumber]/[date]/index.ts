import { NextApiRequest, NextApiResponse } from "next";
import MeterReading from "../../../../../../interfaces/MeterReading";
import { HttpError } from "../../../interfaces/HttpError";
import createMeterReading from "./create";
import deleteMeterReading from "./delete";
import listMeterReading from "./list";
import updateMeterReading from "./update";

type HandlerFunctions = { 
  [key: string]: (req: NextApiRequest) => Promise<MeterReading> 
};

function handler(
  req: NextApiRequest, 
  res: NextApiResponse
): Promise<MeterReading | HttpError> {
  return new Promise(async (resolve, reject) => {

    if (!req || !req.method) {
      return reject(new HttpError(
        'No Request or Invalid Request Method',
        'No request or an invalid request method was sent to the server',
        400
      ));
    }
  
    const handlers: HandlerFunctions = {
      GET: listMeterReading,
      POST: createMeterReading,
      PATCH: updateMeterReading,
      DELETE: deleteMeterReading
    }
  
    return await handlers[req.method](req)
    .then((response) => {
      res.status(200).json(response);
      return resolve(response);
    })
    .catch((errors: any) => {
      res.status(errors[0].status || 500).json({errors: errors})
      return reject(errors);
    });
  });
}

export default handler;