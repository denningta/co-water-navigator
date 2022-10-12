import { Expr } from "faunadb"
import { q } from "../faunaClient"

const getAgentInfo = (user_id: string | Expr) =>   
q.Let(
  {
    agentInfo: 
      q.Map(
        q.Paginate(
          q.Match(q.Index('agent-info-by-user_id'), [user_id])
        ),
        q.Lambda(
          'agentInfo',
          q.Select(['data'], q.Get(q.Var('agentInfo')))
        )
      )
  },
  q.If(
    q.ContainsPath(['data', 0], q.Var('agentInfo')),
    q.Select(['data', 0], q.Var('agentInfo')),
    {}
  )
)  


export default getAgentInfo