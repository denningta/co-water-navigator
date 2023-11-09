import { NextApiRequest, NextApiResponse } from "next";
import MeterReading from "../../../../../../interfaces/MeterReading";
import { HttpError } from "../../../interfaces/HttpError";
import createMeterReading from "./create";
import deleteMeterReading from "./delete";
import listMeterReading from "./list";
import updateMeterReading from "./update";

type HandlerFunctions = {
  [key: string]: (req: NextApiRequest) => Promise<MeterReading | MeterReading[]>
};

async function meterReadingHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<MeterReading | HttpError> {
  if (!req || !req.method) throw new Error('Invalid request or request method')

  const handlers: HandlerFunctions = {
    GET: listMeterReading,
    POST: createMeterReading,
    PATCH: updateMeterReading,
    DELETE: deleteMeterReading
  }

  return handlers[req.method](req)
    .then((response) => {
      res.status(200).json(response);
      return response
    })
    .catch((errors: any) => {
      res.status(errors[0].status || 500).json({ errors: errors })
      return errors
    });
}

export default meterReadingHandler
