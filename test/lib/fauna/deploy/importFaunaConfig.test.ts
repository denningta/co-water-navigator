import { fauna, importFaunaConfig } from "../../../../lib/fauna/deploy/import-fauna-config"

describe('importFaunaConfig', () => {

  test('import config file', async () => {
    await importFaunaConfig('lib/fauna/deploy/fauna-config.json')




  })

  afterAll(() => {
    fauna.close()
  })

})
