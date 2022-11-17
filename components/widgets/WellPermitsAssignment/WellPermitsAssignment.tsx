import { useState } from "react"
import { MdOutlineModeEditOutline } from "react-icons/md"
import wellPermitColumnDefs, { defaultColDef } from "./well-permit-column-defs"
import DataTable from "../DataTable/DataTable"
import { useRouter } from "next/router"
import Heatmap from "../../common/Heatmap"
import QuickSearch from "../../common/QuickSearch"

interface Props {
  rowData?: any[] | undefined
}

const WellPermitsAssignment = ({ rowData }: Props) => {
  const [quickFilter, setQuickFilter] = useState<string | undefined>(undefined)

  const handleChange = (value: string) => {
    setQuickFilter(value)
  }

  return (
    <div>
      <div className="flex items-center mb-4">
        <div className="text-xl font-bold">Your Well Permits</div>
      </div> 

      <QuickSearch onChange={handleChange}/>

      <div className="flex overflow-hidden">
        <div className="w-full mr-4">
          <DataTable 
            defaultColDef={defaultColDef}
            columnDefs={wellPermitColumnDefs} 
            rowData={rowData} 
            suppressRowClickSelection={true}
            height={520}
            quickFilter={quickFilter}
          />
        </div>
      </div>

    </div>
  )
}

export default WellPermitsAssignment