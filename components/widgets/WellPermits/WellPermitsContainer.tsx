import { ColDef } from "ag-grid-community"
import { useState } from "react"
import { MdMenu } from "react-icons/md"
import ColumnSelector from "./ColumnSelector"
import wellPermitColumnDefs from "./well-permit-column-defs"
import WellPermitTable from "./WellPermitTable"

const WellPermitsContainer = () => {
  const [expanded, setExpanded] = useState(false)
  const [columnDefs, setColumnDefs] = useState<ColDef[]>(wellPermitColumnDefs)

  const handleClick = () => {
    setExpanded(!expanded)
  }

  const handleSelectionChange = (colDefs: ColDef[]) => {
    setColumnDefs(colDefs)
  }

  return (
    <div>
      <div className="flex items-center mb-4">
        <div>Well Permits Assigned to you</div>
        <div className="grow"></div>
        <button 
          onClick={handleClick}
          className="btn-round">
          <MdMenu />
        </button>
      </div>
      <div className="flex overflow-hidden">
        <div className="w-full mr-4">
          <WellPermitTable columnDefs={columnDefs} rowData={[]} />
        </div>
        <div className={`${expanded ? 'w-[200px]' : 'w-[0px]'} transition-all ease-in-out`}>
          <ColumnSelector 
            columnDefs={wellPermitColumnDefs} 
            selectionChanged={(colDefs) => handleSelectionChange(colDefs)} 
          />
        </div>
      </div>
    </div>
  )
}

export default WellPermitsContainer