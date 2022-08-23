import MeterReading from "../../../interfaces/MeterReading"
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from "ag-grid-react";
import { useRef, useState } from "react";
import { dateFormatter } from "./helpers";
import { ColDef } from "ag-grid-community";

interface Props {
  meterReadings: MeterReading[]
}

const ReadingsGrid = ({ meterReadings }: Props) => {
  const gridRef = useRef<AgGridReact>(null);

  const onGridReady = () => {
    if (!gridRef.current) return
    const { api, columnApi } = gridRef.current
    if (api == null || columnApi == null) return
    api.sizeColumnsToFit()
  }

  const defaultColDef = {
    resizable: true,
    editable: true,
    sortable: false,
    filter: false,
    minWidth: 120,
  }

  const [columnDefs] = useState<ColDef[]>([
    { 
      field: 'date',
      minWidth: 130,
      editable: false,
      sort: 'asc',
      valueFormatter: dateFormatter
    },
    { 
      field: 'flowMeter',
      minWidth: 120,
      valueGetter: (params) => params.data.flowMeter.value,
      tooltipField: 'flowMeter.calculationMessage',
    },
    { 
      field: 'powerMeter',
      valueGetter: (params) => params.data.powerMeter ? params.data.powerMeter.value : ''
    },
    { 
      field: 'powerConsumptionCoef',
      valueGetter: (params) => params.data.powerConsumptionCoef ? params.data.powerConsumptionCoef.value : ''
    },
    { 
      field: 'pumpedThisPeriod',
      valueGetter: (params) => params.data.pumpedThisPeriod ? params.data.pumpedThisPeriod.value : ''
    },
    { 
      field: 'pumpedYearToDate',
      valueGetter: (params) => params.data.pumpedYearToDate ? params.data.pumpedYearToDate.value : ''
    },
    { 
      field: 'availableThisYear',
      valueGetter: (params) => params.data.pumpedYearToDate ? params.data.pumpedYearToDate.value : ''
    },
    { field: 'readBy' },
    { field: 'comments' },
    { field: 'updatedBy' },
  ])

  return (
    <div className="ag-theme-alpine" style={{ height: 400 }}>
    <AgGridReact
      ref={gridRef}
      onGridReady={onGridReady}
      rowData={meterReadings}
      defaultColDef={defaultColDef}
      columnDefs={columnDefs}
    >
    </AgGridReact>
</div>
  )
}

export default ReadingsGrid