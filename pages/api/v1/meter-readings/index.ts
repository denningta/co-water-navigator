import { Document } from "fauna";
import { NextApiRequest, NextApiResponse } from "next";
import MeterReading from "../../../../interfaces/MeterReading";
import createMeterReadings from "./create";
import { deleteMeterReadings } from "./delete";
import listMeterReadings from "./list";
import updateMeterReadings from "./update";

type HandlerFunctions = {
  [key: string]: (req: NextApiRequest) => Promise<Array<Document & MeterReading>>
};

async function meterReadingsHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Array<Document & MeterReading> | undefined> {

  if (!req || !req.method) {
    throw new Error('Invalid request or request method')
  }

  const handlers: HandlerFunctions = {
    GET: listMeterReadings,
    POST: createMeterReadings,
    DELETE: deleteMeterReadings,
    PATCH: updateMeterReadings
  }

  try {
    const response = await handlers[req.method](req)
    res.status(200).json(response);
    return response

  } catch (error: any) {
    res.status(500).json(error)
  }

}

export default meterReadingsHandler;
