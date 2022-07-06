import { NextApiRequest } from "next";
import MeterReading from "../../../../../interfaces/MeterReading";
import faunaClient, { q } from "../../../../../lib/faunaClient";
import validateQuery from "../validatorFunctions";

function listMeterReadings(req: NextApiRequest): Promise<MeterReading[]> {
  return new Promise(async (resolve, reject) => {
    const errors = validateQuery(req, [
      'queryExists',
    ]);

    if (errors.length) return reject(errors);

  });
}

export default listMeterReadings;
