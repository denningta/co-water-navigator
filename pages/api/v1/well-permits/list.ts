import { QuerySuccess, QueryValue } from "fauna";
import { NextApiRequest } from "next";
import fauna from "../../../../lib/fauna/faunaClientV10";
import getWellPermits, { WellPermitsQuery } from "../../../../lib/fauna/ts-queries/well-permits/getWellPermits";

function listWellPemitsHandler(req: NextApiRequest) {

  const { query } = req

  const { id, permitNumber } = query


  if (!id?.length && !permitNumber?.length) throw new Error('Invalid query: must include valid query parameters')

  let validatedQuery: WellPermitsQuery = {}

  if (id) validatedQuery.ids = Array.isArray(id) ? id : [id]
  if (permitNumber) validatedQuery.permitNumbers = Array.isArray(permitNumber) ? permitNumber : [permitNumber]



  const response = listWellPermits(validatedQuery)
  return response

}



export async function listWellPermits(query: WellPermitsQuery) {

  try {
    const { data }: QuerySuccess<QueryValue[]> = await fauna.query(getWellPermits(query))
    return data

  } catch (error: any) {
    throw new Error(error)
  }
}

export default listWellPemitsHandler
