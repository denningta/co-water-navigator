import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import { PermitRef } from "../../../../../../interfaces/WellPermit";
import { updatePermitRefs } from "../../../../auth/user/update-app-meta-data";
import { HttpError } from "../../../interfaces/HttpError";
import { listWellPermitsByPermitRef } from "../list";

async function approveHandler(
  req: NextApiRequest, 
  res: NextApiResponse
): Promise<any | HttpError> {
  if (!req || !req.method) throw new Error('Invalid request or request method')

  if (req.method === 'POST') {
    const { userId } = req.query
    if (!userId) throw new Error('userId was not included in the query')
    if (Array.isArray(userId)) throw new Error('Querying by a single userId is allowed at a time')

    const { permitRefs }: { permitRefs: PermitRef[] } = req.body
    if (!permitRefs) throw new Error('No document_id query was defined')
    if (!Array.isArray(permitRefs)) throw new Error('Must provide an array of permitRefs')

    try {
      const { app_metadata } = await updatePermitRefs(
        userId, 
        permitRefs.map(ref => ({ ...ref, status: 'approved' }))
      )
      if (!app_metadata) throw new Error('No app_metadata returned.  Something went wrong.')
      const wellPermitAssignmentData = await listWellPermitsByPermitRef(app_metadata.permitRefs)
      res.status(200).json(wellPermitAssignmentData)

    } catch (error: any) {
      res.status(error.status || 500).json(error)
    }
  }
}

export default withApiAuthRequired(approveHandler);

