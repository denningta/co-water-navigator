import { Document } from "fauna";
import { NextApiRequest } from "next";
import { WellUsage } from "../../../../interfaces/ModifiedBanking";
import fauna from "../../../../lib/fauna/faunaClientV10";
import upsertWellUsageQuery from "../../../../lib/fauna/ts-queries/well-usage/upsertWellUsageQuery";

const upsertWellUsage = async (req: NextApiRequest) => {
  try {
    if (!req.body) throw new Error('No body included in the request')

    const { permitNumber, year } = req.body

    if (!permitNumber || !year)
      throw new Error('permitNumber and year must be defined')

    if (permitNumber && Array.isArray(permitNumber))
      throw new Error('Only a single permitNumber may be defined.')

    if (year && Array.isArray(year))
      throw new Error('Only a single year may be defined.')

    const { data } = await fauna.query<Document & WellUsage>(upsertWellUsageQuery(permitNumber, year, req.body))

    return data

  } catch (error: any) {
    return error
  }
}

export default upsertWellUsage
