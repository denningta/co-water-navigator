import { Document } from "fauna";
import { NextApiRequest, NextApiResponse } from "next";
import MeterReading from "../../../../../../interfaces/MeterReading";
import { HttpError } from "../../../interfaces/HttpError";
import createMeterReading from "./create";
import deleteMeterReading from "./delete";
import listMeterReading from "./list";
import updateMeterReading from "./update";

export type MeterReadingResponse = Document & MeterReading

type HandlerFunctions = {
  [key: string]: (req: NextApiRequest) => Promise<MeterReadingResponse | MeterReadingResponse[]>
};

async function meterReadingHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<MeterReadingResponse | MeterReadingResponse[]> {
  if (!req || !req.method) throw new Error('Invalid request or request method')

  const handlers: HandlerFunctions = {
    GET: listMeterReading,
    POST: createMeterReading,
    PATCH: updateMeterReading,
    DELETE: deleteMeterReading
  }

  try {
    const response = handlers[req.method](req)
    res.status(200).json(response);
    return response

  } catch (error: any) {
    res.status(500).json(error)
    throw new Error(error)
  }
}

export default meterReadingHandler
