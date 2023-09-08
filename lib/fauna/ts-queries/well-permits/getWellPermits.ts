import { fql } from "fauna"

export interface WellPermitsQuery {
  ids?: string[]
  permitNumbers?: string[]

}

const getWellPermits = (query: WellPermitsQuery) => {
  const { ids = null, permitNumbers = null } = query

  if (!ids && !permitNumbers) throw new Error('Invalid query paramters')


  return fql`
    let set = [
      ${permitNumbers ? getWellPermitsByPermitNumber(permitNumbers) : null},
      ${ids ? getWellPermitsById(ids) : null}
    ]

    intersection(set)
  `
}


export const getWellPermitsById = (ids: string[]) =>
  fql`
    wellPermits.where((doc) => ${ids}.includes(doc.id))
  `

export const getWellPermitsByPermitNumber = (permitNumbers: string[]) =>
  fql`
    wellPermits.where((doc) => ${permitNumbers}.includes(doc.permit))
  `

export default getWellPermits
