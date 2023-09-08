import { NextApiRequest } from "next";
import { PermitRef, WellPermitWithRecords } from "../../../../../interfaces/WellPermit";
import { getUser } from "../../../auth/[user_id]/get-user";
import fauna from "../../../../../lib/fauna/faunaClientV10";
import getWellPermits from "../../../../../lib/fauna/ts-queries/well-permits/getWellPermits";
import { QuerySuccess, QueryValueObject } from "fauna";

async function handleListWellPemitsByUser(req: NextApiRequest): Promise<any> {

  const { user_id } = req.query

  if (!user_id) throw new Error('user_id was not included in the query')
  if (Array.isArray(user_id)) throw new Error('Querying by a single user_id is allowed at a time')

  try {
    const user = await getUser(user_id)

    if (!user) throw new Error(`User with user_id: ${user_id} not found`)

    if (!user.app_metadata?.permitRefs) return []
    const permitRefs = user.app_metadata.permitRefs

    const wellPermitAssignments = await listWellPermitsByPermitRef(permitRefs)

    return wellPermitAssignments

  } catch (error: any) {
    throw new Error(error)
  }
}

export const listWellPermitsByPermitRef = async (permitRefs: PermitRef[]): Promise<WellPermitWithRecords[]> => {
  const ids = permitRefs.map(permitRef => permitRef.document_id)

  const { data }: QuerySuccess<QueryValueObject[]> = await fauna.query(getWellPermits({ ids: ids }))


  const wellPermitAssignments: WellPermitWithRecords[] = data.map((wellPermit) => {
    const permitRef = permitRefs.find(permitRef => permitRef.document_id === wellPermit?.id)
    return {
      ...wellPermit,
      permit: wellPermit.permit as string,
      id: wellPermit.id as string,
      status: permitRef?.status,
    }
  })

  return wellPermitAssignments
}

export default handleListWellPemitsByUser
