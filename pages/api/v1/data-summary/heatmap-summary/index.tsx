import { NextApiRequest, NextApiResponse } from "next";
import faunaClient, { q } from "../../../../../lib/fauna/faunaClient";
import getLastMeterReadingPrevYear from "../../../../../lib/fauna/ts-queries/getLastMeterReadingPrevYear";
import getModifiedBankingQuery from "../../../../../lib/fauna/ts-queries/getModifiedBankingQuery";
import getHeatmapSummary from "../../../../../lib/fauna/ts-queries/getHeatmapSummary";

async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
): Promise<any> {
  try {
    if (!req || !req.method) {
      throw new Error('No request or request method defined.')
    }

    const { permitNumber }  = req.query

    if (!permitNumber)
      throw new Error('permitNumber and year must be defined')

    if (permitNumber && Array.isArray(permitNumber)) 
      throw new Error('Only a single permitNumber may be defined.')

    const response = await faunaClient.query(getHeatmapSummary(permitNumber))

    res.status(200).json(response)

  } catch (error: any) {
    res.status(error?.status || 500).json(error)
  }



}

export default handler;
