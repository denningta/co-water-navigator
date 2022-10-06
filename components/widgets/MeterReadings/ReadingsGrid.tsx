import MeterReading from "../../../interfaces/MeterReading"
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from "ag-grid-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { calculatedValueGetter, calculatedValueSetter, dateFormatter, getCellClassRules, initPlaceholderData } from "./helpers";
import { CellValueChangedEvent, ColDef, ColumnApi, GetRowIdFunc, GetRowIdParams, GridApi, ICellRendererParams } from "ag-grid-community";
import TableLoading from "../../common/TableLoading";
import CalcValueCellRenderer from "./CalcValueCellRenderer";
import AbstractCellRenderer from "./CalcValueCellRenderer";

interface Props {
  meterReadings: MeterReading[],
  permitNumber: string
  year: string
  onCalculating?: (calculating: boolean | undefined) => void
}

const ReadingsGrid = ({ meterReadings, permitNumber, year, onCalculating = () => {} }: Props) => {
  const gridRef = useRef<AgGridReact>(null);
  const [gridApi, setGridApi] = useState<GridApi | null>(null)
  const [columnApi, setColumnApi] = useState<ColumnApi | null>(null)

  useEffect(() => {
    onCalculating(undefined)
  }, [])

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
      cellClassRules: getCellClassRules('date'),
    },
    { 
      field: 'flowMeter',
      minWidth: 120,
      valueGetter: (params) => calculatedValueGetter(params, 'flowMeter'),
      valueSetter: (params) => calculatedValueSetter(params, 'flowMeter'),
      cellClassRules: getCellClassRules('flowMeter'),
      cellRenderer: (params: ICellRendererParams) => CalcValueCellRenderer(params, 'flowMeter')
    },
    { 
      field: 'powerMeter',
      valueGetter: (params) => calculatedValueGetter(params, 'powerMeter'),
      valueSetter: (params) => calculatedValueSetter(params, 'powerMeter'),
      cellClassRules: getCellClassRules('powerMeter'),
      cellRenderer: (params: ICellRendererParams) => CalcValueCellRenderer(params, 'powerMeter')
    },
    { 
      field: 'powerConsumptionCoef',
      valueGetter: (params) => calculatedValueGetter(params, 'powerConsumptionCoef'),
      valueSetter: (params) => calculatedValueSetter(params, 'powerConsumptionCoef'),
      cellClassRules: getCellClassRules('powerConsumptionCoef'),
      cellRenderer: (params: ICellRendererParams) => CalcValueCellRenderer(params, 'powerConsumptionCoef')
    },
    { 
      field: 'pumpedThisPeriod',
      valueGetter: (params) => calculatedValueGetter(params, 'pumpedThisPeriod'),
      valueSetter: (params) => calculatedValueSetter(params, 'pumpedThisPeriod'),
      cellClassRules: getCellClassRules('pumpedThisPeriod'),
      cellRenderer: (params: ICellRendererParams) => CalcValueCellRenderer(params, 'pumpedThisPeriod')
    },
    { 
      field: 'pumpedYearToDate',
      valueGetter: (params) => calculatedValueGetter(params, 'pumpedYearToDate'),
      valueSetter: (params) => calculatedValueSetter(params, 'pumpedYearToDate'),
      cellClassRules: getCellClassRules('pumpedYearToDate'),
      cellRenderer: (params: ICellRendererParams) => CalcValueCellRenderer(params, 'pumpedYearToDate')
    },
    {
      field: 'availableThisYear',
      valueGetter: (params) => calculatedValueGetter(params, 'availableThisYear'),
      valueSetter: (params) => calculatedValueSetter(params, 'availableThisYear'),
      cellClassRules: getCellClassRules('availableThisYear'),
      cellRenderer: (params: ICellRendererParams) => CalcValueCellRenderer(params, 'availableThisYear')
    },
    { field: 'readBy' },
    { field: 'comments' },
    { 
      field: 'updatedBy',
      editable: false,
      cellClassRules: getCellClassRules('updatedBy')
    },
  ])

  const handleCellValueChange = async ({ data }: CellValueChangedEvent) => {
    onCalculating(true)
    const url = `/api/v1/meter-readings/${data.permitNumber}/${data.date}`
    try {
      await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(data => updateGridRows(data))
      onCalculating(false)
    } catch (error: any) {
      onCalculating(false)
    }
    

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