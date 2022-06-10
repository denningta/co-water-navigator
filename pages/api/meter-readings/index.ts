import { NextApiRequest, NextApiResponse } from "next";
import MeterReading from "../../../interfaces/MeterReading";
import createMeterReading from "./create";
import readMeterReadings from "./read";

type HandlerFunctions = { [key: string]: () => Promise<void> };

const testMeterReading: MeterReading = {
  permitNumber: '12345',
  month: 8,
  year: 2021,
  flowMeter: {
    value: 120,
    shouldBe: 120,
    calculationState: 'success',
    source: 'user'
  },
  createdAt: new Date(),
  updatedAt: new Date()
}

async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (!req || !req.method) {
    res.status(400).end();
    return;
  }

  const handlers: HandlerFunctions = {
    GET: async () => {
      return await readMeterReadings(req.query)
        .then((res) => res)
        .catch((error) => error)
    },
    POST: async () => {
      return await createMeterReading(testMeterReading)
        .then((res) => res)
        .catch((error) => error)
    }
  }

  if (!handlers[req.method]) {
    return res.status(405).end();
  }

  await handlers[req.method]()
    .then(response => res.status(200).json(response))
    .catch(error => res.status(500).json(error));
  

}

export default handler;
