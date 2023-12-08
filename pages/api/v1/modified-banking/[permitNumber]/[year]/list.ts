import { Document } from "fauna";
import { NextApiRequest, NextApiResponse } from "next";
import { ModifiedBanking } from "../../../../../../interfaces/ModifiedBanking";
import fauna from "../../../../../../lib/fauna/faunaClientV10";
import getModifiedBanking from "../../../../../../lib/fauna/ts-queries/modified-banking/listModifiedBanking";

async function listModifiedBanking(req: NextApiRequest, res: NextApiResponse): Promise<ModifiedBanking> {
  try {
    const { permitNumber, year } = req.query;

    if (!permitNumber || !year)
      throw new Error('permitNumber and year must be defined')

    if (permitNumber && Array.isArray(permitNumber))
      throw new Error('Only a single permitNumber may be defined.')

    if (year && Array.isArray(year))
      throw new Error('Only a single year may be defined.')

    const { data } = await fauna.query<Document & ModifiedBanking>(getModifiedBanking(permitNumber, year))

    return data

  } catch (error: any) {
    return error
  }
}

export default listModifiedBanking;
