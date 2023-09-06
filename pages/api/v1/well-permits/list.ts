import { QuerySuccess, QueryValue } from "fauna";
import { NextApiRequest } from "next";
import fauna from "../../../../lib/fauna/faunaClientV10";
import getWellPermits, { WellPermitsQuery } from "../../../../lib/fauna/ts-queries/well-permits/getWellPermits";

function listWellPemitsHandler(req: NextApiRequest) {

  const { query } = req

  const { ids, permitNumbers } = query

  if (!ids?.length && !permitNumbers?.length) throw new Error('Invalid query: must include valid query parameters')

  let validatedQuery: WellPermitsQuery = {}

  if (ids) validatedQuery.ids = [...ids]
  if (permitNumbers) validatedQuery.permitNumbers = [...permitNumbers]


  const response = listWellPermits(validatedQuery)
  return response

}



export async function listWellPermits(query: WellPermitsQuery) {

  try {
    const response: QuerySuccess<QueryValue[]> = await fauna.query(getWellPermits(query))
    return response

  } catch (error: any) {
    console.log(error)
    throw new Error(error)
  }
}

export default listWellPemitsHandler
