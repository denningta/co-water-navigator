import { useState } from "react"
import { MdOutlineModeEditOutline } from "react-icons/md"
import wellPermitColumnDefs, { defaultColDef } from "./well-permit-column-defs"
import DataTable from "../DataTable/DataTable"
import { useRouter } from "next/router"

interface Props {
  rowData?: any[] | undefined
}

const WellPermitsAssignment = ({ rowData }: Props) => {

  return (
    <div>
      <div className="flex items-center mb-4">
        <div className="text-xl font-bold">Your Well Permits</div>
      </div> 

      <div className="flex overflow-hidden">
        <div className="w-full mr-4">
          <DataTable 
            defaultColDef={defaultColDef}
            columnDefs={wellPermitColumnDefs} 
            rowData={rowData} 
            rowSelection="single"
          />
        </div>
      </div>
    </div>
  )
}

export default WellPermitsAssignment