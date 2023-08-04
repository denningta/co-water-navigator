import { q } from "../faunaClient";

const getWellPermitRecords = (permitNumber: string) =>
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
    },
    q.Select(['data'], q.Var('wellPermit'))
  )

export default getWellPermitRecords
