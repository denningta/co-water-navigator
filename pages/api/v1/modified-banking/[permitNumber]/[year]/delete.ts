import { Document } from "fauna";
import { NextApiRequest, NextApiResponse } from "next";
import { ModifiedBanking } from "../../../../../../interfaces/ModifiedBanking";
import fauna from "../../../../../../lib/fauna/faunaClientV10";
import { deleteModifiedBankingByPermitYear } from "../../../../../../lib/fauna/ts-queries/modified-banking/deleteModifiedBanking";

async function deleteModifiedBanking(req: NextApiRequest, res: NextApiResponse) {
  const { permitNumber, year } = req.query;

  if (Array.isArray(permitNumber)) throw new Error('permitNumber query must be a single value.  Array provided.')
  if (!permitNumber) throw new Error('permitNumber query paramter is required')
  if (Array.isArray(year)) throw new Error('year query must be a single value.  Array provided.')
  if (!year) throw new Error('year query paramter is required')

  try {
    const { data } = await fauna.query<Document & ModifiedBanking>(deleteModifiedBankingByPermitYear(permitNumber, year))

    return null

  } catch (error: any) {
    throw new Error(error)
  }


}

export default deleteModifiedBanking;
