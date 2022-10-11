import useSWR from "swr"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    error.message = await res.json()
    throw error
  }
  return res.json()
}


const useDataSummaryByPermit = (permitNumber: string | undefined) => {
  const { data, mutate } = useSWR(
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
  const { data, mutate } = useSWR(
    '/api/v1/data-summary',
    fetcher
  )

  return {
    data: data,
    mutate: mutate
  }
}

export default useDataSummaryByPermit