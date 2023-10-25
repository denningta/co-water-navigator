import useSWR from "swr"
import MeterReading from "../interfaces/MeterReading"
import { ModifiedBanking, ModifiedBankingSummary, WellUsage } from "../interfaces/ModifiedBanking"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    error.message = await res.json()
    throw error
  }
  return res.json()
}

export interface DataSummary {
  permitNumber: string
  year: string
  dbb004Summary: MeterReading[]
  dbb004BankingSummary: ModifiedBankingSummary
  dbb013Summary: ModifiedBanking[]
  wellUsage: WellUsage
}


const useDataSummaryByPermit = (permitNumber: string | undefined) => {
  const { data, mutate } = useSWR<DataSummary[]>(
    (permitNumber)
      ? `/api/v1/data-summary?permitNumber=${permitNumber}`
      : null,
    fetcher
  )
  return {
    data: data,
    mutate: mutate
  }
}

export const useDataSummaryTotal = () => {
  const { data, mutate } = useSWR<DataSummary[]>(
    '/api/v1/data-summary',
    fetcher
  )

  return {
    data: data,
    mutate: mutate
  }
}

export const useDataSummaryBySession = () => {
  const { data, mutate } = useSWR<DataSummary[]>(
    `/api/v1/data-summary/session`,
    fetcher
  )

  return {
    data,
    mutate
  }
}

export default useDataSummaryByPermit
