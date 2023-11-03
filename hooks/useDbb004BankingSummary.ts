import useSWR from "swr"
import { ModifiedBankingSummary } from "../interfaces/ModifiedBanking"

const fetcher = async (url: string, permitNumber: string, year: string) => {
  const res = await fetch(url + '?permitNumber=' + permitNumber + '&year=' + year)
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    error.message = await res.json()
    throw error
  }
  return res.json()
}

const useDbb004BankingSummary = (
  permitNumber: string | undefined,
  year: string | undefined
) => {
  const { data, mutate } = useSWR<ModifiedBankingSummary>([
    (permitNumber && year) ? `/api/v1/data-summary/dbb004-banking-summary` : null,
    permitNumber,
    year
  ],
    fetcher
  )

  console.log(data)

  return {
    data: data,
    mutate: mutate
  }
}

export default useDbb004BankingSummary
