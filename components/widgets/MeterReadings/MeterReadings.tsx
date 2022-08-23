import { useEffect, useState } from "react"
import ReadingsGrid from "./ReadingsGrid"
import useSWR from 'swr'
import { useRouter } from "next/router"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const MeterReadingsComponent = () => {
  const { query } = useRouter()
  const permitNumber = Array.isArray(query.permitNumber) ? query.permitNumber[0] : query.permitNumber
  const year = Array.isArray(query.year) ? query.year[0] : query.year
  const meterReadings = useSWR(`/api/v1/meter-readings?permitNumber=${permitNumber}&year=${year}`, fetcher)

  return (
    <div>
      <ReadingsGrid meterReadings={meterReadings.data} />
    </div>
  )

}

export default MeterReadingsComponent