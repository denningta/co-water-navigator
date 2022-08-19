import { NextApiRequest, NextApiResponse } from "next";
import { AdministrativeReport } from "../../../../../../interfaces/AdministrativeReport";
import { HttpError } from "../../../interfaces/HttpError";
import createAdministrativeReport from "./create";
import deleteAdministrativeReport from "./delete";
import listAdministrativeReport from "./list";
import updateAdministrativeReport from "./update";

type HandlerFunctions = { 
  [key: string]: (req: NextApiRequest) => Promise<AdministrativeReport> 
};

function handler(
  req: NextApiRequest, 
  res: NextApiResponse
): Promise<AdministrativeReport | HttpError> {
    if (!req || !req.method) {
      return Promise.reject(new HttpError(
        'No Request or Invalid Request Method',
        'No request or an invalid request method was sent to the server',
        400
      ));
    }
  
    const handlers: HandlerFunctions = {
      GET: listAdministrativeReport,
      POST: createAdministrativeReport,
      PATCH: updateAdministrativeReport,
      DELETE: deleteAdministrativeReport
    }
  
    return handlers[req.method](req)
      .then((response) => {
        res.status(200).json(response);
        return response
      })
      .catch((errors: any) => {
        res.status(errors[0].status || 500).json({errors: errors})
        return errors
      });
}

export default handler;