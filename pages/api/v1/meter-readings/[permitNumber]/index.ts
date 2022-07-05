import { NextApiRequest, NextApiResponse } from "next";
import MeterReading from "../../../../../interfaces/MeterReading";
import createMeterReading from "./[date]/create";
import deleteMeterReading from "./[date]/delete";
import listMeterReadings from "./list";
import updateMeterReading from "./[date]/update";
import {validateRequest} from "../validatorFunctions";

type HandlerFunctions = { [key: string]: () => Promise<void> };

async function handler(req: NextApiRequest, res: NextApiResponse): Promise<MeterReading[]> {

  const handlers: HandlerFunctions = {
    GET: async () => {
      return await listMeterReadings(req)
        .then((res) => res)
        .catch((error) => error)
    },
    POST: async () => {
      return await createMeterReading(req)
        .then((res) => res)
        .catch((error) => error)
    },
    PATCH: async () => {
      return await updateMeterReading(req)
        .then((res) => res)
        .catch(error => error)
    },
    DELETE: async () => {
      return await deleteMeterReading(req)
        .then((res) => res)
        .catch((error) => error)
    }
  }

  if (!handlers[req.method]) {
    res.status(405).end();
    return Promise.reject({
      error: 'Invalid Request Method',
      detail: 'An invalid request method was sent to the server',
      status: 405,
      statusDetail: 'Bad Request'
    });
  }

  return await handlers[req.method](req)
    .then((res: any) => {
      return res
    })
    .catch((error: any) => {
      // console.log('error :', JSON.stringify(error));
      res.status(500).json(error)
      return error
    });
  

}

export default handler;
