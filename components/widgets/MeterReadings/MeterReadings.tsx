import { useEffect, useState } from "react"
import ReadingsGrid from "./ReadingsGrid"
import useSWR from 'swr'
import { useRouter } from "next/router"
import CalendarYearSelector from "../CalendarYearSelector/CalendarYearSelector"
import WellUsage from "./WellUsage"
import ModifiedBankingSummary from "./ModifiedBankingSummary"
import MeterReading from "../../../interfaces/MeterReading"
import TableLoading from "../../common/TableLoading"

interface Props {
  meterReadings: MeterReading[]
  permitNumber: string | undefined
  year: string | undefined
}

const MeterReadingsComponent = ({meterReadings, permitNumber, year}: Props) => {
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
        { !meterReadings && 
          <TableLoading height={600} numberOfRows={11} />
        }
        { (meterReadings && permitNumber && year) && 
          <ReadingsGrid meterReadings={meterReadings} permitNumber={permitNumber} year={year} /> 
        }
      </div>
    </div>
  )

}

export default MeterReadingsComponent