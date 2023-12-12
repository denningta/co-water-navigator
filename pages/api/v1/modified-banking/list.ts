import { Document } from "fauna";
import { NextApiRequest } from "next";
import { ModifiedBanking } from "../../../../interfaces/ModifiedBanking";
import fauna from "../../../../lib/fauna/faunaClientV10";
import { getModifiedBankingRecords } from "../../../../lib/fauna/ts-queries/modified-banking/listModifiedBanking";

async function listAdministrativeReports(req: NextApiRequest) {

  const { permitNumber, year } = req.query


  let permitNumbers: string[] | null = null
  let years: string[] | null = null

  if (!permitNumber) {
    permitNumbers = null
  } else if (Array.isArray(permitNumber)) {
    permitNumbers = permitNumber
  } else {
    permitNumbers = [permitNumber as string]
  }

  if (!year) {
    years = null
  } else if (Array.isArray(year)) {
    years = year
  } else {
    years = [year as string]
  }

  try {
    const { data } = await fauna.query<Array<Document & ModifiedBanking>>(getModifiedBankingRecords(permitNumbers, years))

    return data

  } catch (error: any) {
    throw new error(error)
  }
}

export default listAdministrativeReports;
