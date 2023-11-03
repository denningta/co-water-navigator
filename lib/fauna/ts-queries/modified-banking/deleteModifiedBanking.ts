import { fql } from "fauna";

export default function deleteModifiedBanking(id: string) {
  return fql`
    administrativeReports.byId(${id})!.delete()
  `
}
