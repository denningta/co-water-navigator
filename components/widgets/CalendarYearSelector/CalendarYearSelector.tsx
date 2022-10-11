import { ColDef, ColumnApi, GridApi, RowClickedEvent, SelectionChangedEvent } from "ag-grid-community"
import { AgGridReact } from "ag-grid-react"
import { useRouter } from "next/router"
import { useCallback, useEffect, useRef, useState } from "react"
import YearPicker from "./YearPicker"
import { initCalendarYearPlaceholderData } from "./helpers"
import useSWR from "swr"
import MeterReading from "../../../interfaces/MeterReading"
import { ModifiedBanking } from "../../../interfaces/ModifiedBanking"
import DataSummaryCellRenderer from "./DataSummaryCellRenderer"
import useDataSummary from "../../../hooks/useDataSummaryByPermit"
import ShowExistingData from "./ShowExistingData"
import { yearSelectorColDefs, yearSelectorDefaultColDef } from "./calendar-year-selector-coldefs"
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

export interface CalendarYearSelectorData {
  year: string
  dbb004Summary?: MeterReading[]
  dbb013Summary?: ModifiedBanking[]
}

interface Props {
  permitNumber: string | undefined
  year: string | undefined
  columnDefs?: ColDef[]
  defaultColDef?: ColDef
  rowSelection?: 'single' | 'multiple';
  onlyDataFilterDefault?: boolean
  onYearChanged?: (selectedYear: string) => void
  onSelectionChanged?: (event: SelectionChangedEvent<any>) => void
}

const CalendarYearSelector = ({ 
  permitNumber,
  year, 
  columnDefs = yearSelectorColDefs,
  defaultColDef = yearSelectorDefaultColDef,
  rowSelection = 'single',
  onlyDataFilterDefault = false,
  onYearChanged = () => {} ,
  onSelectionChanged = () => {}
}: Props) => {
  const gridRef = useRef<AgGridReact>(null);
  const { data, mutate } = useDataSummary(permitNumber)
  const [api, setApi] = useState<GridApi | undefined>(undefined)
  const [columnApi, setColumnApi] = useState<ColumnApi | undefined>(undefined)
  const [rowData, setRowData] = useState<CalendarYearSelectorData[] | undefined>(undefined)
  const [onlyDataFilter, setOnlyDataFilter] = useState<boolean>(onlyDataFilterDefault)

  useEffect(() => {
    if (!year || !data) return
    if (!onlyDataFilter) {      
      const rowData = initCalendarYearPlaceholderData(year, 5).map(record => 
        data.find((el: any) => record.year === el.year) ?? record
      )
      setRowData(rowData)
    } else {
      setRowData(data)
    }
  }, [data, year, onlyDataFilter])

  const onGridReady = () => {
    if (!gridRef.current) return
    if (gridRef.current.api) setApi(gridRef.current.api)
    if (gridRef.current.columnApi) setColumnApi(gridRef.current.columnApi)
  }

  useEffect(() => {
    if (!api) return
    api.sizeColumnsToFit()
    if (year) {
      setTimeout(() => {
        api.getRowNode(year)?.setSelected(true)
      }, 500)
    }
  }, [api, year])

  const getRowId = (params: any) => params.data.year 

  const handleRowClick = ({ data }: RowClickedEvent) => {
    onYearChanged(data.year)
  }

  const handleSubmit = (jumpToYear: string) => {
    onYearChanged(jumpToYear)
  }

  const handleFilterChange = (checked: boolean) => {
    setOnlyDataFilter(checked)
  }

  const handleSelectionChange = (event: SelectionChangedEvent<any>) => {
    onSelectionChanged(event)
  }

  return (
    <div>
      <div className="grid grid-cols-8 gap-6">
        <div className="ag-theme-alpine col-span-6" style={{ height: 265 }}>
          <AgGridReact
            ref={gridRef}
            onGridReady={onGridReady}
            rowData={rowData}
            defaultColDef={defaultColDef}
            columnDefs={columnDefs}
            rowSelection={rowSelection}
            onRowClicked={handleRowClick}
            suppressCellFocus={true}
            getRowId={getRowId}
            onSelectionChanged={handleSelectionChange}
          >
          </AgGridReact>
        </div>
        <div className="w-full h-full col-span-2 flex flex-col justify-center">
          <div className="flex justify-center mb-6">
            <YearPicker onSubmit={(year) => handleSubmit(year)} />
          </div>
          <div className="flex justify-center">
            <ShowExistingData onChange={handleFilterChange} checked={onlyDataFilter} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarYearSelector