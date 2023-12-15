import getPermitPreview from "../../../../../lib/fauna/ts-queries/permit-preview/getPermitPreview"

describe('getPermitPreview', () => {

  test('undefined query parameter ids returns empty array', async () => {

    const { data } = fauna.query(getPermitPreview(undefined))

  })

})
