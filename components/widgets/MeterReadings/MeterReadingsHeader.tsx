import { TiExport } from 'react-icons/ti'
import BreadcrumbsRouter from '../../common/BreadcrumbsRouter'
import Button from '../../common/Button'

interface Props {
  permitNumber?: string
  year?: string
  owner?: string
  location?: string
}

const MeterReadingsHeader = ({ permitNumber }: Props) => {
  return (
    <div className="flex items-center">
      <div>
        <div className="font-thin">WELL PERMIT</div>
        {permitNumber && <div className="font-extrabold text-3xl">{permitNumber}</div>}
        <div className="mt-2">
          <BreadcrumbsRouter />
        </div>
      </div>
      <div className="grow"></div>
      <div className="hidden md:flex items-center h-full mr-8">
        <Button title="Export" href="/export" icon={<TiExport />} type="button" />
      </div>
    </div>
  )
}

export default MeterReadingsHeader
