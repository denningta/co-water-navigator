import { q } from "../../faunaClient";

const getWellPermitRecord = (permitNumber: string) =>
  q.Let(
    {
      wellPermits:
        q.Map(
          q.Paginate(
            q.Match(q.Index('well-permits-by-permit'), [permitNumber])
          ),
          q.Lambda(
            'wellPermit',
            q.Select(['data'], q.Get(q.Var('wellPermit')))
          )
        ),
      wellPermit:
        q.If(
          q.ContainsPath(['data', 0], q.Var('wellPermits')),
          q.Select(['data', 0], q.Var('wellPermits')),
          []
        ),
      wellPermitRecord:
        q.If(
          q.ContainsPath(['records', 0], q.Var('wellPermit')),
          q.Get(q.Select(['records', 0], q.Var('wellPermit'))),
          []
        )
    },
    q.Select(['data'], q.Var('wellPermitRecord'))
  )

export default getWellPermitRecord
