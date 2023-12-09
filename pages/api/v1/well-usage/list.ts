import { Document } from "fauna";
import { NextApiRequest } from "next";
import { WellUsage } from "../../../../interfaces/ModifiedBanking";
import fauna from "../../../../lib/fauna/faunaClientV10";
import getWellUsageQuery from "../../../../lib/fauna/ts-queries/well-usage/getWellUsageQuery";

const getWellUsage = async (req: NextApiRequest) => {
  try {
    const { permitNumber, year } = req.query

    if (!permitNumber || !year)
      throw new Error('permitNumber and year must be defined')

    if (permitNumber && Array.isArray(permitNumber))
      throw new Error('Only a single permitNumber may be defined.')

    if (year && Array.isArray(year))
      throw new Error('Only a single year may be defined.')

    const { data } = await fauna.query<Document & WellUsage>(getWellUsageQuery(permitNumber, year))

    return data

  } catch (error: any) {
    throw new Error(error)
  }
}

export default getWellUsage
