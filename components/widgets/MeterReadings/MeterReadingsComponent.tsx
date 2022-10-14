import { useEffect, useState } from "react"
import ReadingsGrid from "./ReadingsGrid"
import useSWR from 'swr'
import { useRouter } from "next/router"
import CalendarYearSelector from "../CalendarYearSelector/CalendarYearSelector"
import WellUsageComponent from "./WellUsageComponent"
import ModifiedBankingSummary from "./ModifiedBankingSummary"
import MeterReading from "../../../interfaces/MeterReading"
import TableLoading from "../../common/TableLoading"
import { BsInfoLg } from 'react-icons/bs'
import { Dialog, DialogTitle, List } from "@mui/material"
import MeterReadingsInfoDialog from "./MeterReadingsInfoDialog"
import useMeterReadings from "../../../hooks/useMeterReadings"
import { WellUsage } from "../../../interfaces/ModifiedBanking"

interface Props {
  permitNumber: string | undefined
  year: string | undefined
  onCalculating?: (calculating: boolean | undefined) => void
}

const MeterReadingsComponent = ({permitNumber, year, onCalculating = () => {} }: Props) => {
  const { data, mutate } = useMeterReadings(permitNumber, year)
  const [openDialog, setOpenDialog] = useState(false)

  const handleClick = () => {
    setOpenDialog(true)
  }

  const handleClose = () => {
    setOpenDialog(false)
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="col-span-3 font-bold text-2xl flex items-center">
        <div>Meter Readings (DBB-004)</div>
        <div className="grow"><span className="ml-8 mr-2 font-thin text-xl">CALENDAR YEAR</span> {year}</div>
        <div><button className="btn-round" onClick={handleClick}><BsInfoLg /></button></div>
      </div>
      <div className="col-span-1">
        <WellUsageComponent permitNumber={permitNumber} year={year} />
      </div>
      <div className="col-span-2">
        <ModifiedBankingSummary permitNumber={permitNumber} year={year} />
      </div>

      <div className="col-span-3">
        { !data && 
          <TableLoading height={600} numberOfRows={11} />
        }
        { (data && permitNumber && year) && 
          <ReadingsGrid 
            meterReadings={data} 
            permitNumber={permitNumber} 
            year={year} 
            onCalculating={onCalculating} 
          /> 
        }
      </div>
      <MeterReadingsInfoDialog open={openDialog} onClose={handleClose} />
    </div>
  )

}

export default MeterReadingsComponent