import { NextApiRequest } from "next";
import { ModifiedBanking } from "../../../../../../interfaces/ModifiedBanking";
import faunaClient, { q } from "../../../../../../lib/fauna/faunaClient";
import getModifiedBankingQuery from "../../../../../../lib/fauna/ts-queries/getModifiedBankingQuery";
import { HttpError } from "../../../interfaces/HttpError";
import validateQuery from "../../../validatorFunctions";

async function listModifiedBanking(req: NextApiRequest): Promise<ModifiedBanking> {
  try {
    const {permitNumber, year} = req.query;

    if (!permitNumber || ! year)
      throw new Error('permitNumber and year must be defined')

    if (permitNumber && Array.isArray(permitNumber)) 
      throw new Error('Only a single permitNumber may be defined.')

    if (year && Array.isArray(year)) 
      throw new Error('Only a single year may be defined.')

    const response: ModifiedBanking = await faunaClient.query(getModifiedBankingQuery(permitNumber, year))
    return response
    
  } catch (error: any) {
    return error
  }    
}

export default listModifiedBanking;
