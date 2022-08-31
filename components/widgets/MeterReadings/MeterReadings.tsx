import { useEffect, useState } from "react"
import ReadingsGrid from "./ReadingsGrid"
import useSWR from 'swr'
import { useRouter } from "next/router"
import CalendarYearSelector from "../CalendarYearSelector/CalendarYearSelector"
import WellUsage from "./WellUsage"
import ModifiedBankingSummary from "./ModifiedBankingSummary"
import MeterReading from "../../../interfaces/MeterReading"
import TableLoading from "../../common/TableLoading"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const MeterReadingsComponent = () => {
  const router = useRouter()
  const { query } = router
  let permitNumber, year: string | undefined = undefined

  if (router.isReady) {
    permitNumber = Array.isArray(query.permitNumber) ? query.permitNumber[0] : query.permitNumber
    year = Array.isArray(query.year) ? query.year[0] : query.year
  }
  
  const { data, error } = useSWR(
    (permitNumber && year) 
    ? `/api/v1/meter-readings?permitNumber=${permitNumber}&year=${year}` 
    : null, 
    fetcher
  )

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="col-span-3 font-bold text-2xl">
        Meter Readings (DBB-004)
        <span className="ml-8 mr-1 font-thin text-xl">CALENDAR YEAR</span> {year}
      </div>
      <div className="col-span-1">
        <WellUsage />
      </div>
      <div className="col-span-2">
        <ModifiedBankingSummary />
      </div>

      <div className="col-span-3">
        { !data && 
          <TableLoading height={600} numberOfRows={11} />
        }
        { (data && permitNumber && year) && 
          <ReadingsGrid meterReadings={data} permitNumber={permitNumber} year={year} /> 
        }
      </div>
    </div>
  )

}

export default MeterReadingsComponent