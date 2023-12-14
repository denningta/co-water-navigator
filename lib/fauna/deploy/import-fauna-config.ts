import { Client, Document, fql } from "fauna"
import fs from "fs"
import dotenv from "dotenv"
import chalk from "chalk"

dotenv.config()
const cliSecret = process.env.FAUNA_CLI_SECRET
const endpoint = process.env.FAUNADB_ENDPOINT || 'https://db.fauna.com/'

const log = console.log

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
    const { data } = await fauna.query<Document>(fql`
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

    log(chalk.green(`
      Successfully Imported: 
        Collections: ${collections.length}
        Functions: ${functions.length}
        Roles: ${roles.length}
    `))

    return data


  } catch (error: any) {
    log(chalk.red('Error: ', error))
    throw new Error(error)
  }
}
