import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { AgGridReact } from "ag-grid-react"
import { useState } from "react"
import Checkbox from '../../common/Checkbox';
import wellPermitColumnData from './well-permit-column-defs';

interface Props {
  columnDefs: ColDef[]
  rowData: any[]
}

const WellPermitTable = ({ columnDefs, rowData }: Props) => {
  
  return (
    <div className="ag-theme-alpine" style={{ height: 400 }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
      >
      </AgGridReact>
    </div>
  )
}

export default WellPermitTable