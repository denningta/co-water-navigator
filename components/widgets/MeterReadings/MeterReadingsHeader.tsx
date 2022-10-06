import { Breadcrumbs } from '@mui/material'
import Link from '@mui/material/Link'
import { TiExport } from 'react-icons/ti'
import { IoHome } from 'react-icons/io5'
import { BsChevronRight } from 'react-icons/bs'
import BreadcrumbsRouter from '../../common/BreadcrumbsRouter'
import Button from '../../common/Button'
import ExportDialog from '../Export Dialog/ExportDialog'
import { useState } from 'react'

interface Props {
  permitNumber?: string
  year?: string
  owner?: string
  location?: string
}

const MeterReadingsHeader = ({ permitNumber, year, owner, location }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleClick = () => {
    setDialogOpen(true)
  }

  const handleClose = () => {
    setDialogOpen(false)
  }

  return (
    <div className="flex items-center">
      <div>
        <div className="font-thin">WELL PERMIT</div>
        { permitNumber && <div className="font-extrabold text-3xl">{ permitNumber }</div>}
        <div className="mt-2">
          <BreadcrumbsRouter />
        </div>
      </div>
      <div className="grow"></div>
      <div className="flex items-center h-full mr-8">
        <Button title="Export" icon={<TiExport />} type="button" onClick={handleClick} />
        <ExportDialog open={dialogOpen} onClose={handleClose} permitNumber={permitNumber} year={year} />
      </div>
    </div>
  )
}

export default MeterReadingsHeader