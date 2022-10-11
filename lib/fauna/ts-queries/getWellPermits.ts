import { q } from "../faunaClient";

export const getWellPermits = (document_ids: string[]) => 
q.Map(
  q.Map(
    document_ids,
    q.Lambda('document_id', 
      {
        document: q.Select(['data'], q.Get(q.Ref(q.Collection('wellPermits'), q.Var('document_id')))),
        document_id: q.Var('document_id')
      }
    )
  ),
  q.Lambda('wellPermit',
  q.Let(
    {
      recordRefs: q.Select(['document', 'records'], q.Var('wellPermit')),
      records: q.Map(q.Var('recordRefs'),
        q.Lambda('ref',
          q.Select(['data'], q.Get(q.Var('ref')))
        )
      )
    },
    {
      document: {
        permit: q.Select(['document', 'permit'], q.Var('wellPermit')),
        records: q.Var('records'),
      },
      document_id: q.Select(['document_id'], q.Var('wellPermit'))
    }
  )
)
)