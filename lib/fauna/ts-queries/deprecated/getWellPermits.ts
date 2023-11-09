import { Expr } from "faunadb";
import { q } from "../../faunaClient";
import { WellPermitsQuery } from "../well-permits/getWellPermits";

const getWellPermits = (query: WellPermitsQuery) => {
  const { ids, permitNumbers } = query

  let faunaQuery: Expr | undefined = undefined

  if (permitNumbers) faunaQuery = getWellPermitsByPermitNumber(permitNumbers)
  if (ids) faunaQuery = getWellPermitsByDocumentId(ids)
  if (!faunaQuery) throw new Error('Invalid query paramters')

  return (
    q.Map(
      faunaQuery,
      q.Lambda('wellPermit',
        q.Var('wellPermit')
      )
    )
  )
}


export const getWellPermitsByDocumentId = (document_ids: string[] | Expr) =>
  q.Map(
    document_ids,
    q.Lambda('document_id',
      q.Select(['data'], q.Get(q.Ref(q.Collection('wellPermits'), q.Var('document_id')))),
    )
  )


export const getWellPermitsByPermitNumber = (permitNumbers: string[] | Expr) =>
  q.Select(['data'],
    q.Map(
      q.Paginate(
        q.Union(
          q.Map(
            permitNumbers,
            q.Lambda(
              'permitNumber',
              q.Match(q.Index('well-permits-by-permit'), q.Var('permitNumber'))
            )
          )
        )
      ),
      q.Lambda('ref',
        q.Select(['data'],
          q.Get(q.Var('ref'))
        )
      )
    )
  )

export default getWellPermits
