import { Expr } from "faunadb";
import { q } from "../faunaClient";

export const getWellPermitsByPermitNumber = (permitNumber: string | Expr) =>
  q.Select(['data'],
    q.Map(
      q.Paginate(
        q.Match(q.Index('well-permits-by-permit'), [permitNumber])
      ),
      q.Lambda(
        'wellPermit',
        q.Select(['data'], q.Get(q.Var('wellPermit')))
      )
    )
  )
