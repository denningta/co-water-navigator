import { Document } from "fauna";
import { NextApiRequest } from "next";
import { DataSummary } from "../../../../hooks/useDataSummaryByPermit";
import faunaClient from "../../../../lib/fauna/faunaClient";
import fauna from "../../../../lib/fauna/faunaClientV10";
import getDataSummary from "../../../../lib/fauna/ts-queries/data-summary/getDataSummary";
import getUniquePermitNumbersWithData from "../../../../lib/fauna/ts-queries/getUniquePermitNumbersWithData";

async function listDataSummary(req: NextApiRequest): Promise<any[]> {
  try {
    const { permitNumber } = req.query

    let permitNumbers = permitNumber

    if (!permitNumbers) {
      permitNumbers = await faunaClient.query(getUniquePermitNumbersWithData())
    }

    if (!permitNumbers) throw new Error('No meter readings or modified banking data found')
    if (!Array.isArray(permitNumbers)) permitNumbers = [permitNumbers]

    const { data } = await fauna.query<Array<Document & DataSummary>>(getDataSummary(permitNumbers))

    return data

  } catch (error: any) {
    return error
  }

}

export default listDataSummary
