import { Client, fql } from "fauna"
import fs from "fs"
import dotenv from "dotenv"

dotenv.config()
const cliSecret = process.env.FAUNA_CLI_SECRET
const endpoint = process.env.FAUNADB_ENDPOINT || 'https://db.fauna.com/'

export const fauna = new Client({
  endpoint: new URL(endpoint),
  secret: cliSecret,
  typecheck: false
})

importFaunaConfig('lib/fauna/deploy/fauna-config.json')
export async function importFaunaConfig(path: string) {

  const {
    collections,
    functions,
    roles
  } = JSON.parse(fs.readFileSync(path, 'utf8'))


  try {
    const { data } = await fauna.query(fql`
      let collections = (Collection.all() {
        name,
        history_days,
        indexes,
        constraints,
        data
      }).toArray()
      upsertCollections(${collections})
      upsertFunctions(${functions})
      upsertRoles(${roles})
    `)

    return data

  } catch (error: any) {
    throw new Error(error)
  }
}
