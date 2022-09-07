import { ColDef } from "ag-grid-community"
import { useEffect, useState } from "react"
import { MdMenu } from "react-icons/md"
import ColumnSelector from "./WellPermitsTable/ColumnSelector"
import wellPermitColumnDefs from "./WellPermitsTable/well-permit-column-defs"
import WellPermitTable from "./WellPermitsTable/WellPermitTable"

const WellPermitsContainer = () => {

  return (
    <div>
      <div className="flex items-center mb-4">
        <div>Well Permits Assigned to you</div>
      </div>
      <div className="flex overflow-hidden">
        <div className="w-full mr-4">
          <WellPermitTable columnDefs={wellPermitColumnDefs} rowData={[]} />
        </div>
      </div>
    </div>
  )
}

export default WellPermitsContainer