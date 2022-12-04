/* eslint-disable no-console */
const dotenv = require('dotenv')
const fs = require('fs')
const faunadb = require('faunadb')

dotenv.config()

const cliSecret = process.env.FAUNA_CLI_SECRET

if (!cliSecret) process.exit(1)

const faunaClient = new faunadb.Client({
  secret: cliSecret,
});

const q = faunadb.query

const filterResource = (object) => 
  q.ToObject(q.Filter(q.ToArray(object),
    q.Lambda('element',
      q.And(
        q.Not(q.Equals(q.Select([0], object), 'ref')),
        q.Not(q.Equals(q.Select([0], object), 'ts'))
      )
    )
  ))

const importCollections = (config) => 
  q.Map(
    q.Select(['collections'], config),
    q.Lambda('element',
      q.Let(
        {
          name: q.Select(['name'], q.Var('element'), [null]),
          collection: filterResource(q.Var('element'))
        },
        q.If(
          q.IsCollection(q.Collection(q.Var('name'))),
          q.Update(q.Collection(q.Var('name')), q.Var('collection')),
          q.CreateCollection(q.Var('collection'))
        )
      )
    )
  )

const importIndexes = (config) =>
  q.Map(
    q.Select(['indexes'], config, [null]),
    q.Lambda('element',
      q.Let(
        {
          name: q.Select(['name'], q.Var('element'), [null]),
          index: filterResource(q.Var('element'))
        },
        q.If(
          q.IsIndex(q.Index(q.Var('name'))),
          q.Update(q.Index(q.Var('name')), q.Var('index')),
          q.CreateIndex(q.Var('index'))
        )
      )
    )
  )

const importFunctions = (config) => 
  q.Map(
    q.Select(['functions'], config, [null]),
    q.Lambda('element',
      q.Let(
        {
          name: q.Select(['name'], q.Var('element'), [null]),
          fn: filterResource(q.Var('element')) 
        },
        q.If(
          q.IsFunction(q.Function(q.Var('name'))),
          q.Update(q.Function(q.Var('name')), q.Var('fn')),
          q.CreateFunction(q.Var('fn'))
        )
      )
    )
  )

const importRoles = (config) =>
  q.Map(
    q.Select(['roles'], config, [null]),
    q.Lambda('element',
      q.Let(
        {
          name: q.Select(['name'], q.Var('element')),
          role: filterResource(q.Var('element'))
        },
        q.If(
          q.IsRole(q.Role(q.Var('name'))),
          q.Update(q.Role(q.Var('name')), q.Var('role')),
          q.CreateRole(q.Var('role'))
        )
      )
    )
  )

const importDbConfig = async (path) => {
  const config = faunadb.parseJSON(fs.readFileSync(path, 'utf8'));

  try {
    const response = await faunaClient.query(
      q.Let(
        {
          config: config,
        },
        q.Do(
          importCollections(q.Var('config')),
          importIndexes(q.Var('config')),
          importFunctions(q.Var('config')),
          importRoles(q.Var('config'))
        )
      )
    )

    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

const args = process.argv



importDbConfig('lib/fauna/deploy/config.json')