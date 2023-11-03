import { fql } from "fauna"

export default function getDbb004BankingSummary(id: string) {
  return fql`
    modifiedBankingSummary.byId('${id}')!.delete()
  `
}
