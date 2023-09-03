import { Expr } from "faunadb";

type FaunaResponse<T> = Array<{
  ref: Expr
  ts: number
  data: T
}>

export default FaunaResponse
