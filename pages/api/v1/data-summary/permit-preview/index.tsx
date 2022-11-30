import { getSession } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import faunaClient, { q } from "../../../../../lib/fauna/faunaClient";
import getHeatmapSummary from "../../../../../lib/fauna/ts-queries/getHeatmapSummary";
import getMeterReadings from "../../../../../lib/fauna/ts-queries/getMeterReadings";
import getPermitPreview from "../../../../../lib/fauna/ts-queries/getPermitPreview";
import { getWellPermits } from "../../../../../lib/fauna/ts-queries/getWellPermits";

async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
): Promise<any> {
  try {
    if (!req || !req.method) {
      throw new Error('No request or request method defined.')
    }

    const session = getSession(req, res)
    const { permitRefs } = session?.user.app_metadata

    const document_ids = permitRefs 
      ? permitRefs.filter((el: any) => el.status === 'approved').map((el: any) => el.document_id)
      : []

    const response = await faunaClient.query(
      getPermitPreview(document_ids)
    )

    res.status(200).json(response)

  } catch (error: any) {
    res.status(error?.status || 500).json(error)
  }
}

export default handler;
