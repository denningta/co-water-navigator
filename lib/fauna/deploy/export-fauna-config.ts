import { Client, fql } from "fauna"
import fs from "node:fs"
import dotenv from "dotenv"

dotenv.config()
const cliSecret = process.env.DEV_FAUNA_CLI_SECRET
const endpoint = process.env.FAUNADB_ENDPOINT || 'https://db.fauna.com/'

const fauna = new Client({
  endpoint: new URL(endpoint),
  secret: cliSecret,
  typecheck: false
})

getFaunaDatabaseConfig()

export async function getFaunaDatabaseConfig() {

  try {
    const { data } = await fauna.query(fql`
      {
        functions: (Function.all(){
          name,
          body,
          role
        }).toArray(),

        collections: (Collection.all() {
          name,
          history_days,
          indexes,
          constraints,
          data
        }).toArray(),

        roles: (Role.all() {
          name,
          membership,
          privileges,
          data
        }).toArray()
      }
    `)

    fs.writeFileSync('lib/fauna/deploy/fauna-config.json', JSON.stringify(data))

  } catch (error: any) {
    throw new Error(error)
  }
}

