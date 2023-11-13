import { fql } from "fauna";

export default function getMeterReading(permitNumber: string, date: string) {

  return fql`
    let permitNumber = ${permitNumber}
    let date = ${date}

    meterReadings.firstWhere(.permitNumber == permitNumber && .date == date)
  `
}
