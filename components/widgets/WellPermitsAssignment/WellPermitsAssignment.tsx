import { useState } from "react"
import { MdOutlineModeEditOutline } from "react-icons/md"
import wellPermitColumnDefs from "./well-permit-column-defs"
import WellPermitTable from "../WellPermitsTable/WellPermitTable"
import { useRouter } from "next/router"

interface Props {
  rowData?: any[] | undefined
}

const WellPermitsAssignment = ({ rowData = [] }: Props) => {
  const [selectedRowData, setSelectedRowData] = useState<any>(undefined)
  const router = useRouter()

  const handleRowSelectionChange = (rowData: any[]) => {
    setSelectedRowData(rowData[0])
  }

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault()
    router.push(`/well-permits/${selectedRowData.permit}`)
  }

  return (
    <div>
      <div className="flex items-center mb-4">
        <div className="text-xl font-bold">Your Well Permits</div>
      </div> 

      <button 
        onClick={handleClick}
        className={`flex items-center mb-4  rounded-lg py-3 drop-shadow w-fit transition ease-in-out ${(selectedRowData) ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-400'}`}
        disabled={!selectedRowData}
      >
          <div className="flex items-center px-4">
            <span className="text-xl">
              <MdOutlineModeEditOutline className=" font-extrabold" />
            </span>
            <span className="ml-1">Manage Meter Readings</span>
          </div>
          { selectedRowData && 
          <span className="border-l border-slate-300 px-4 ">
            {selectedRowData.permit }
          </span>
        }
      </button>

      <div className="flex overflow-hidden">
        <div className="w-full mr-4">
          <WellPermitTable 
            columnDefs={wellPermitColumnDefs} 
            rowData={rowData} 
            rowSelection="single"
            onRowSelectionChanged={handleRowSelectionChange}
          />
        </div>
      </div>
    </div>
  )
}

export default WellPermitsAssignment