import { fql } from "fauna"

const getWellPermitRecordsByPermitNumber = (permitNumbers: string[]) =>
  fql`wellPermitRecords.where((value) => ${permitNumbers}.includes(value.permit))`

export default getWellPermitRecordsByPermitNumber
