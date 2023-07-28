import { useState } from "react"
import ReadingsGrid from "./ReadingsGrid"
import WellUsageComponent from "./WellUsageComponent"
import ModifiedBankingSummary from "./ModifiedBankingSummary"
import { BsInfoLg } from 'react-icons/bs'
import { MdArrowDropUp, MdRefresh } from 'react-icons/md'
import MeterReadingsInfoDialog from "./MeterReadingsInfoDialog"
import axios from "axios"
import { useSnackbar } from "notistack"
import { Tooltip } from "@mui/material"

interface Props {
  permitNumber: string | undefined
  year: string | undefined
  onCalculating?: (calculating: boolean | undefined) => void
}

const MeterReadingsComponent = ({ permitNumber, year, onCalculating = () => { } }: Props) => {
  const [openDialog, setOpenDialog] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const handleClick = () => {
    setOpenDialog(true)
  }

  const handleClose = () => {
    setOpenDialog(false)
  }

  const refreshCalculations = async () => {
    onCalculating(true)
    try {
      await axios.post(`/api/v1/meter-readings/${permitNumber}/calculate`)
      onCalculating(false)
    } catch (error) {
      enqueueSnackbar('Something went wrong', { variant: 'error' })
    }
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="relative col-span-3 font-bold text-2xl md:flex md:items-center">
        <div className="absolute top-0 right-16">
          <Tooltip title="Re-calculate">
            <button className="btn-round" onClick={refreshCalculations}>
              <MdRefresh size={25} />
            </button>
          </Tooltip>
        </div>
        <div>Meter Readings (DBB-004)</div>
        <div className="md:grow"><span className="md:ml-8 mr-2 font-thin text-xl">CALENDAR YEAR</span> {year}</div>
        <div className="absolute top-0 right-0">
          <button className="btn-round" onClick={handleClick}><BsInfoLg size={25} /></button>
        </div>
      </div>
      <div className="col-span-3 md:col-span-1">
        <WellUsageComponent permitNumber={permitNumber} year={year} />
      </div>
      <div className="col-span-3 md:col-span-2">
        <ModifiedBankingSummary permitNumber={permitNumber} year={year} />
      </div>

      <div className="col-span-3">
        {(permitNumber && year) &&
          <ReadingsGrid
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
