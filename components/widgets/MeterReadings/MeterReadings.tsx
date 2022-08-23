import { useEffect, useState } from "react"
import ReadingsGrid from "./ReadingsGrid"
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const MeterReadingsComponent = () => {
  const meterReadings = useSWR('/api/v1/meter-readings?permitNumber=XX-00000', fetcher)

  return (
    <div>
      <ReadingsGrid meterReadings={meterReadings.data} />
    </div>
  )

}

export default MeterReadingsComponent