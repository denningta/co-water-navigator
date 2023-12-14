import { Client, fql } from "fauna"
import fs from "node:fs"
import dotenv from "dotenv"
import chalk from "chalk"

dotenv.config()
const cliSecret = process.env.DEV_FAUNA_CLI_SECRET
const endpoint = process.env.FAUNADB_ENDPOINT || 'https://db.fauna.com/'

const log = console.log

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

    const dir = 'lib/fauna/deploy/fauna-config.json'

    fs.writeFileSync(dir, JSON.stringify(data))

    log(chalk.green('Successfully exported database config to ' + chalk.white(dir)))

  } catch (error: any) {
    log(chalk.red('Error: ', error))
    throw new Error(error)
  }
}

