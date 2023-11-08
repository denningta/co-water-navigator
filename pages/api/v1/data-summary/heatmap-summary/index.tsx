import { Document } from "fauna";
import { NextApiRequest, NextApiResponse } from "next";
import { HeatmapSummary } from "../../../../../hooks/useHeatmapSummary";
import fauna from "../../../../../lib/fauna/faunaClientV10";
import getHeatmapSummary from "../../../../../lib/fauna/ts-queries/data-summary/getHeatmapSummary";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any> {
  try {
    if (!req || !req.method) {
      throw new Error('No request or request method defined.')
    }

    const { permitNumber } = req.query

    if (!permitNumber)
      throw new Error('permitNumber and year must be defined')

    if (permitNumber && Array.isArray(permitNumber))
      throw new Error('Only a single permitNumber may be defined.')

    const { data } = await fauna.query<Document & HeatmapSummary>(getHeatmapSummary(permitNumber))

    res.status(200).json(data)
    return data

  } catch (error: any) {
    res.status(error?.status || 500).json(error)
    return error
  }



}

export default handler;
