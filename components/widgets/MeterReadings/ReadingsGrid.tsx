/* eslint-disable react-hooks/exhaustive-deps */
import MeterReading from "../../../interfaces/MeterReading"
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from "ag-grid-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { dateFormatter, getCellClassRules, initPlaceholderData } from "./helpers";
import { CellValueChangedEvent, ColDef, ColumnApi, GetRowIdFunc, GetRowIdParams, GridApi, ICellRendererParams, ValueGetterParams, ValueSetterParams } from "ag-grid-community";
import { createCalculatedValueColDef, readingsGridDefaultColDef } from "./readings-grid-colDefs";
import useMeterReadings from "../../../hooks/useMeterReadings";
import { useSnackbar } from "notistack";
import { useUser } from "@auth0/nextjs-auth0";
import axios from "axios";

interface Props {
  permitNumber: string
  year: string
  onCalculating?: (calculating: boolean | undefined) => void
}

const ReadingsGrid = ({ permitNumber, year, onCalculating = () => { } }: Props) => {
  const { data, mutate } = useMeterReadings(permitNumber, year)
  console.log(data)
  const gridRef = useRef<AgGridReact>(null);
  const [gridApi, setGridApi] = useState<GridApi | null>(null)
  const [columnApi, setColumnApi] = useState<ColumnApi | null>(null)
  const [rowData, setRowData] = useState<MeterReading[]>(initPlaceholderData(permitNumber, year))
  const { enqueueSnackbar } = useSnackbar()
  const { user } = useUser()

  useEffect(() => {
    onCalculating(undefined)
  }, [])


  useEffect(() => {
    if (!data) return
    const placeholderData = initPlaceholderData(permitNumber, year).map(record => {
      return data.find(el =>
        el.date === record.date) ?? record
    })
    setRowData(placeholderData)
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

  const numberValidator = (params: ValueSetterParams) => {
    const test = isFinite(+params.newValue)
    if (!test) enqueueSnackbar('Invalid input: value must be a number', { variant: 'error' })
    return test;
  }

  const readByValidator = (params: ValueSetterParams) => {
    const test = params.newValue.length <= 3
    if (!test) enqueueSnackbar('Invalid input: value must be a three letter initial', { variant: 'error' })
    return test
  }

  const [defaultColDef] = useState<ColDef>(readingsGridDefaultColDef)
  const [columnDefs] = useState<ColDef[]>([
    {
      field: 'date',
      minWidth: 120,
      editable: false,
      sort: 'asc',
      valueFormatter: dateFormatter,
      cellClassRules: getCellClassRules('date'),
    },
    createCalculatedValueColDef('flowMeter', numberValidator),
    createCalculatedValueColDef('powerMeter', numberValidator),
    {
      ...createCalculatedValueColDef('powerConsumptionCoef', numberValidator),
      headerName: "Power Coefficient",
      minWidth: 134
    },
    createCalculatedValueColDef('pumpedThisPeriod', numberValidator),
    createCalculatedValueColDef('pumpedYearToDate', numberValidator),
    createCalculatedValueColDef('availableThisYear', numberValidator),
    {
      field: 'readBy',
      valueSetter: (params) => {
        if (readByValidator(params)) {
          params.data.readBy = params.newValue
          return true
        } else {
          return false
        }
      }
    },
    { field: 'comments', minWidth: 127 },
    {
      field: 'updatedBy',
      editable: false,
      cellClassRules: getCellClassRules('updatedBy'),
      valueGetter: (params: ValueGetterParams) => {
        if (params.data?.updatedBy) return params.data.updatedBy.name
      }
    },
  ])

  const handleCellValueChange = async (event: CellValueChangedEvent) => {
    onCalculating(true)

    const updateData = event.data
    updateData.updatedBy = { name: user?.name, user_id: user?.sub }

    const { newValue, oldValue } = event
    const colId = event.column.getId()

    if (oldValue && !newValue) {
      updateData[colId] = {
        value: 'user-deleted',
        source: 'user-deleted'
      }
    }


    const url = `/api/v1/meter-readings/${event.data.permitNumber}/${event.data.date}`
    try {
      const response = await axios.patch(url, updateData)
      mutate(data)

      onCalculating(false)
    } catch (error: any) {
      onCalculating(false)
      enqueueSnackbar('Something went wrong. Please try again.', { variant: 'error' })
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
