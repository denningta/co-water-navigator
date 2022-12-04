/* eslint-disable no-console */
const dotenv = require('dotenv')
const fs = require('fs');
const faunadb = require('faunadb');

dotenv.config()

const cliSecret = process.env.DEV_FAUNA_CLI_SECRET


if (!cliSecret) process.exit(1)

const faunaClient = new faunadb.Client({
  secret: cliSecret,
});

const q = faunadb.query

const exportDbConfig = async (path) => {
  try {
    const response = await faunaClient.query(
      q.Let(
        { 
          roles: q.Map(
            q.Select(["data"], q.Paginate(q.Roles())), 
            q.Lambda("element", 
              q.Get(q.Var("element"))
            )
          ),
          collections: q.Map(
            q.Select(['data'], q.Paginate(q.Collections())),
            q.Lambda("element", 
              q.Get(q.Var("element"))
            )
          ),
          indexes: q.Map(
            q.Select(['data'], q.Paginate(q.Indexes())),
              q.Lambda("element", 
                q.Get(q.Var("element"))
            )
          ),
          functions: q.Map(
            q.Select(['data'], q.Paginate(q.Functions())),
            q.Lambda("element", 
              q.Get(q.Var("element"))
            )
          )
        },
        {
          collections: q.Var('collections'),
          indexes: q.Var('indexes'),
          functions: q.Var('functions'),
          roles: q.Var('roles')
        }
      )
    )

    fs.writeFileSync('lib/fauna/deploy/config.json', JSON.stringify(response))

  } catch (error) {
    console.log(error)
  }
}



exportDbConfig('lib/fauna/deploy/config.json')
