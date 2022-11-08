/* eslint-disable react-hooks/exhaustive-deps */
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
import { readingsGridColDefs, readingsGridDefaultColDef } from "./readings-grid-colDefs";
import useMeterReadings from "../../../hooks/useMeterReadings";

interface Props {
  permitNumber: string
  year: string
  onCalculating?: (calculating: boolean | undefined) => void
}

const ReadingsGrid = ({ permitNumber, year, onCalculating = () => {} }: Props) => {
  const { data, mutate } = useMeterReadings(permitNumber, year)
  const gridRef = useRef<AgGridReact>(null);
  const [gridApi, setGridApi] = useState<GridApi | null>(null)
  const [columnApi, setColumnApi] = useState<ColumnApi | null>(null)
  const [rowData, setRowData] = useState<MeterReading[]>(initPlaceholderData(permitNumber, year))

  useEffect(() => {
    onCalculating(undefined)
  }, [])

  useEffect(() => {
    if (!data) return
    setRowData(
      rowData.map(record => 
        data.find(el => 
          el.date === record.date) ?? record
        )
      )
  }, [data])

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

  const [defaultColDef] = useState<ColDef>(readingsGridDefaultColDef)
  const [columnDefs] = useState<ColDef[]>(readingsGridColDefs)

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
    <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
      <AgGridReact
        ref={gridRef}
        onGridReady={onGridReady}
        rowData={rowData}
        defaultColDef={defaultColDef}
        columnDefs={columnDefs}
        onCellValueChanged={(event) => handleCellValueChange(event)}
        tooltipShowDelay={0}
        getRowId={getRowId}
        domLayout={'autoHeight'}
      >
      </AgGridReact>
  </div>
  )
}

export default ReadingsGrid