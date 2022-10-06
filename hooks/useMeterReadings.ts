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


const useMeterReadings = (permitNumber: string | undefined, year: string | undefined) => {
  const { data, mutate } = useSWR(
    (permitNumber && year) 
    ? `/api/v1/meter-readings?permitNumber=${permitNumber}&year=${year}` 
    : null, 
    fetcher
  )

  return {
    data: data,
    mutate: mutate
  }
}

export default useMeterReadings