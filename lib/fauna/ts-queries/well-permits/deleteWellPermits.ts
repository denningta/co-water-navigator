import { fql } from "fauna";
import { WellPermit } from "../../../../interfaces/WellPermit";

export default function deleteWellPermits(wellPermits: WellPermit[]) {
  return fql`
    let data = ${wellPermits as any}

    data.forEach(record => {
      wellPermits.where(.permit == record.permit).forEach(doc => doc!.delete())
    })
  `
}
