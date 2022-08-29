import { TiExport } from 'react-icons/ti'

interface Props {
  permitNumber?: string
  owner?: string,
  location?: string
}

const MeterReadingsHeader = ({ permitNumber, owner, location }: Props) => {
  return (
    <div className="flex items-center">
      <div>
        <div className="font-thin">WELL PERMIT</div>
        { permitNumber && <div className="font-extrabold text-2xl">{ permitNumber }</div>}
      </div>
      {owner && 
        <div>
          <div className="font-thin">OWNER</div>
          <div className="font-bold">{ owner }</div> 
        </div> 
      }
      { location && 
        <div>
          <div className="font-thin">LOCATION</div>
          <div className="font-bold">{ location }</div> 
        </div> 
      }
      <div className="grow"></div>
      <div>
        <button type="button" className='mr-10 flex items-center bg-primary rounded-lg hover:drop-shadow-lg px-4 py-2 text-white'>
          <span className='text-2xl'>
            <TiExport /> 
          </span>
          <span className='ml-2'>Export</span>
        </button>
      </div>
    </div>
  )
}

export default MeterReadingsHeader