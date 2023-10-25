import { getSession } from "@auth0/nextjs-auth0"
import { NextApiRequest, NextApiResponse } from "next"
import { DataSummary } from "../../../../../hooks/useDataSummaryByPermit"
import { PermitRef } from "../../../../../interfaces/WellPermit";
import faunaClient from "../../../../../lib/fauna/faunaClient";
import getDataSummary from "../../../../../lib/fauna/ts-queries/getDataSummary";

export default async function listDataSummaryBySession(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<DataSummary[]> {
  const session = getSession(req, res)

  if (!session || !session.user)
    throw new Error('Not authorized')

  const { app_metadata } = session.user

  const permitNumbers = app_metadata.permitRefs.map((ref: PermitRef) => ref.permit)


  try {
    const response: any = await faunaClient.query(getDataSummary(permitNumbers))
    return response

  } catch (error: any) {
    throw new Error(error)
  }
}
