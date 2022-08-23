import MeterReading from "../../../interfaces/MeterReading"
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from "ag-grid-react";
import { useState } from "react";

interface Props {
  meterReadings: MeterReading[]
}

const ReadingsGrid = ({ meterReadings }: Props) => {

  const [columnDefs] = useState([
    { field: 'date' },
    { field: 'flowMeter' },
    { field: 'powerMeter' },
    { field: 'powerConsumptionCoef' },
    { field: 'pumpedThisPeriod' },
    { field: 'pumpedYearToDate' },
    { field: 'availableThisYear' },
    { field: 'readBy' },
    { field: 'comments' },
    { field: 'updatedBy' },
  ])

  return (
    <div className="ag-theme-alpine" style={{ height: 400 }}>
    <AgGridReact
        rowData={meterReadings}
        columnDefs={columnDefs}>
    </AgGridReact>
</div>
  )
}

export default ReadingsGrid