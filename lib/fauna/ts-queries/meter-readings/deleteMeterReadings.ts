import { fql } from "fauna";

export default function deleteMeterReadings(ids: string[]) {
  return fql`
    ${ids}.map(id => meterReadings.byId(id)!.delete())
  `
}
