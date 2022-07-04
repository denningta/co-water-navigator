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

async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
): Promise<MeterReading[] | HttpError> {

  if (!req || !req.method) {
    return Promise.reject({
      error: 'No Request or Invalid Request Method',
      detail: 'No request or an invalid request method was sent to the server',
      status: 400,
      statusDetail: 'Bad Request'
    });
  }

  const handlers: HandlerFunctions = {
    GET: listMeterReading,
    POST: createMeterReading,
    PATCH: updateMeterReading,
    DELETE: deleteMeterReading
  }

  return await handlers[req.method](req)
  .then((response) => {
    console.log(response)
    res.status(200).json(response);
  })
  .catch(errors => {
    console.log(errors);
    res.status(errors[0].status).json({errors: errors})
    return errors;
  });

}

export default handler;