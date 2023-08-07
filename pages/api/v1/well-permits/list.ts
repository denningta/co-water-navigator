import { NextApiRequest } from "next";
import { WellPermitAssignment } from "../../../../interfaces/WellPermit";
import faunaClient from "../../../../lib/fauna/faunaClient";
import { getWellPermits } from "../../../../lib/fauna/ts-queries/getWellPermits";

async function listWellPemits(req: NextApiRequest): Promise<WellPermitAssignment[]> {
  const { document_id } = req.query
  if (!document_id) throw new Error('document_id missing from query')

  try {
    const response: WellPermitAssignment[] = await faunaClient.query(getWellPermits([...document_id]))
    return response

  } catch (error: any) {
    throw new Error(error)
  }

}

export default listWellPemits
