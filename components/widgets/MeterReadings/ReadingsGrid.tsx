import MeterReading from "../../../interfaces/MeterReading"
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from "ag-grid-react";
import { useMemo, useRef, useState } from "react";
import { calculatedValueGetter, calculatedValueSetter, dateFormatter, getCellClassRules, initPlaceholderData } from "./helpers";
import { CellValueChangedEvent, ColDef, ColumnApi, GetRowIdFunc, GetRowIdParams, GridApi } from "ag-grid-community";

interface Props {
  meterReadings: MeterReading[],
  permitNumber: string
  year: string
}

const ReadingsGrid = ({ meterReadings, permitNumber, year }: Props) => {
  const gridRef = useRef<AgGridReact>(null);
  const [gridApi, setGridApi] = useState<GridApi | null>(null)
  const [columnApi, setColumnApi] = useState<ColumnApi | null>(null)

  const rowData = initPlaceholderData(permitNumber, year).map(record => {
    return meterReadings.find(el => {
      return el.date === record.date
    }) ?? record
  })

  const onGridReady = () => {
    if (!gridRef.current) return
    const { api, columnApi } = gridRef.current
    if (api == null || columnApi == null) return
    setGridApi(api)
    setColumnApi(columnApi)
    api.sizeColumnsToFit()
  }

  const getRowId = useMemo<GetRowIdFunc>(() => {
    return (params: GetRowIdParams) => {
      return params.data.date
    }
  }, [])

  const updateGridRows = (meterReadings: MeterReading[]) => {
    console.log(meterReadings)
    meterReadings.forEach(meterReading => {
      const rowNode = gridApi?.getRowNode(meterReading.date)
      rowNode?.setData(meterReading)
    })
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
      minWidth: 150,
      editable: false,
      sort: 'asc',
      valueFormatter: dateFormatter,
      cellClassRules: getCellClassRules('date')
    },
    { 
      field: 'flowMeter',
      minWidth: 120,
      valueGetter: (params) => calculatedValueGetter(params, 'flowMeter'),
      valueSetter: (params) => calculatedValueSetter(params, 'flowMeter'),
      tooltipField: 'flowMeter.calculationMessage',
      cellClassRules: getCellClassRules('flowMeter')
    },
    { 
      field: 'powerMeter',
      valueGetter: (params) => calculatedValueGetter(params, 'powerMeter'),
      valueSetter: (params) => calculatedValueSetter(params, 'powerMeter'),
      tooltipField: 'powerMeter.calculationMessage',
      cellClassRules: getCellClassRules('powerMeter')
    },
    { 
      field: 'powerConsumptionCoef',
      valueGetter: (params) => calculatedValueGetter(params, 'powerConsumptionCoef'),
      valueSetter: (params) => calculatedValueSetter(params, 'powerConsumptionCoef'),
      tooltipField: 'powerConsumptionCoef.calculationMessage',
      cellClassRules: getCellClassRules('powerConsumptionCoef')
    },
    { 
      field: 'pumpedThisPeriod',
      valueGetter: (params) => calculatedValueGetter(params, 'pumpedThisPeriod'),
      valueSetter: (params) => calculatedValueSetter(params, 'pumpedThisPeriod'),
      tooltipField: 'pumpedThisPeriod.calculationMessage',
      cellClassRules: getCellClassRules('pumpedThisPeriod')
    },
    { 
      field: 'pumpedYearToDate',
      valueGetter: (params) => calculatedValueGetter(params, 'pumpedYearToDate'),
      valueSetter: (params) => calculatedValueSetter(params, 'pumpedYearToDate'),
      tooltipField: 'pumpedYearToDate.calculationMessage',
      cellClassRules: getCellClassRules('pumpedYearToDate')
    },
    {
      field: 'availableThisYear',
      valueGetter: (params) => calculatedValueGetter(params, 'availableThisYear'),
      valueSetter: (params) => calculatedValueSetter(params, 'availableThisYear'),
      tooltipField: 'availableThisYear.calculationMessage',
      cellClassRules: getCellClassRules('availableThisYear')
    },
    { field: 'readBy' },
    { field: 'comments' },
    { 
      field: 'updatedBy',
      editable: false,
      cellClassRules: getCellClassRules('updatedBy')
    },
  ])

  const handleCellValueChange = ({ data }: CellValueChangedEvent) => {
    const url = `/api/v1/meter-readings/${data.permitNumber}/${data.date}`
    fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .catch(error => error)
      .then(data => updateGridRows(data))
  }

  return (
    <div className="ag-theme-alpine" style={{ height: 600 }}>
      <AgGridReact
        ref={gridRef}
        onGridReady={onGridReady}
        rowData={rowData}
        defaultColDef={defaultColDef}
        columnDefs={columnDefs}
        onCellValueChanged={(event) => handleCellValueChange(event)}
        tooltipShowDelay={0}
        getRowId={getRowId}
      >
      </AgGridReact>
  </div>
  )
}

export default ReadingsGrid