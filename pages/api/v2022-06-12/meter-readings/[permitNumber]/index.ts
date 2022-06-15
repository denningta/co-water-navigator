import { NextApiRequest, NextApiResponse } from "next";
import MeterReading from "../../../../../interfaces/MeterReading";
import createMeterReading from "./create";
import retrieveMeterReadings from "./retrieve";

type HandlerFunctions = { [key: string]: () => Promise<void> };

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { permitNumber } = req.query;

  if (!permitNumber) {
    return Promise.reject({
      error: 'Undefined parameter',
      detail: 'A value for permitNumber is required.  Ex: .../meter-readings/{permitNumber}',
      status: 400,
      statusDetail: 'Bad Request'
    })
  }

  if (!req || !req.method) {
    res.status(400).end();
    return;
  }

  const handlers: HandlerFunctions = {
    GET: async () => {
      return await retrieveMeterReadings(permitNumber, req.query)
        .then((res) => res)
        .catch((error) => error)
    },
    POST: async () => {
      return await createMeterReading(permitNumber, req.body)
        .then((res) => res)
        .catch((error) => error)
    }
  }

  if (!handlers[req.method]) {
    return res.status(405).end();
  }

  await handlers[req.method]()
    .then((response: any) => {
      console.log('response: ', response)
      res.status(response.status || 200).json(response)
    })
    .catch(error => {
      // console.log('error :', JSON.stringify(error));
      res.status(500).json(error)
    });
  

}

export default handler;
