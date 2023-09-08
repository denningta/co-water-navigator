import { Client } from 'fauna'

const fauna = new Client({
  endpoint: new URL(process.env.FAUNADB_ENDPOINT || ''),
  secret: process.env.FAUNADB_SECRET,
  typecheck: false
})

export default fauna
