import { fql } from "fauna"

export interface WellPermitsQuery {
  ids?: string[]
  permitNumbers?: string[]

}

const getWellPermits = (query: WellPermitsQuery) => {
  const { ids = [], permitNumbers = [] } = query

  if (!ids && !permitNumbers) throw new Error('Invalid query paramters')


  return fql`
    let array1 = ${getWellPermitsByPermitNumber(permitNumbers)}    
    let array2 = ${getWellPermitsById(ids)}

    [
      if (array1.nonEmpty()) array1 else [],
      if (array2.nonEmpty()) array2 else []
    ]
      .where(el => el.nonEmpty())
      .reduce((a, b) => a.filter(c => b.includes(c)))
  `

}


export const getWellPermitsById = (ids: string[]) =>
  fql`
    wellPermits.where((doc) => ${ids}.includes(doc.id)).toArray()
  `

export const getWellPermitsByPermitNumber = (permitNumbers: string[]) =>
  fql`
    wellPermits.where((doc) => ${permitNumbers}.includes(doc.permit)).toArray()
  `

export default getWellPermits
