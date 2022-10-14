import { NextApiRequest, NextApiResponse } from "next";
import { WellUsage } from "../../../../interfaces/ModifiedBanking";
import faunaClient, { q } from "../../../../lib/fauna/faunaClient";
import upsertWellUsageQuery from "../../../../lib/fauna/ts-queries/upsertWellUsageQuery";

const upsertWellUsage = async (req: NextApiRequest) => {
  try {
    if (!req.body) throw new Error('No body included in the request')

    const { permitNumber, year } = req.body 

    if (!permitNumber || ! year)
      throw new Error('permitNumber and year must be defined')

    if (permitNumber && Array.isArray(permitNumber)) 
      throw new Error('Only a single permitNumber may be defined.')

    if (year && Array.isArray(year)) 
      throw new Error('Only a single year may be defined.')


    const response: WellUsage = await faunaClient.query(
      upsertWellUsageQuery(permitNumber, year, req.body)
    )
    return response

  } catch (error: any) {
    return error
  }
}

export default upsertWellUsage