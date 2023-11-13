import { fql } from "fauna"

const getWellPermitRecordsByPermitNumber = (permitNumbers: string[]) =>
  fql`
    let permitNumbers = ${permitNumbers}

    wellPermitRecords.where((value) => permitNumbers.includes(value.permit))
  `

export default getWellPermitRecordsByPermitNumber
