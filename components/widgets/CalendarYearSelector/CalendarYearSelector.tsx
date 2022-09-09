import { ColDef, ColumnApi, GridApi, RowClickedEvent } from "ag-grid-community"
import { AgGridReact } from "ag-grid-react"
import { useRouter } from "next/router"
import { useCallback, useEffect, useRef, useState } from "react"
import YearPicker from "./YearPicker"
import { initCalendarYearPlaceholderData } from "./helpers"
import useSWR from "swr"
import MeterReading from "../../../interfaces/MeterReading"
import { ModifiedBanking } from "../../../interfaces/ModifiedBanking"
import DataSummaryCellRenderer from "./DataSummaryCellRenderer"

export interface CalendarYearSelectorData {
  year: string
  dbb004Summary?: MeterReading[]
  dbb013Summary?: ModifiedBanking[]
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Props {
  data: CalendarYearSelectorData[]
}

const CalendarYearSelector = ({ data }: Props) => {
  const router = useRouter()

  const gridRef = useRef<AgGridReact>(null);
  const [api, setApi] = useState<GridApi | undefined>(undefined)
  const [columnApi, setColumnApi] = useState<ColumnApi | undefined>(undefined)
  const [rowData, setRowData] = useState<CalendarYearSelectorData[] | undefined>(undefined)
  const [year, setYear] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (router.isReady) {
      const y = Array.isArray(router.query.year) ? router.query.year[0] : router.query.year
      setYear(y)
    }
  }, [router.isReady, router.query.year])

  useEffect(() => {
    if (!year || !data) return
    const rowData = initCalendarYearPlaceholderData(year, 5).map(record => 
      data.find((el: any) => record.year === el.year) ?? record
    )
    setRowData(rowData)
  }, [data, year])


  const onGridReady = () => {
    if (!gridRef.current) return
    if (gridRef.current.api) setApi(gridRef.current.api)
    if (gridRef.current.columnApi) setColumnApi(gridRef.current.columnApi)
  }

  useEffect(() => {
    if (!api) return
    api.sizeColumnsToFit()
    if (year) {
      api.getRowNode(year)?.setSelected(true)
    }
  }, [api, year, router.query.year])

  const [defaultColDef] = useState({
    cellStyle: { cursor: 'pointer' },
    suppressNavigable: true,
    cellClass: 'no-border',
    sortable: true,
  })

  const [columnDefs] = useState<ColDef[]>([
    { 
      field: 'year',
      maxWidth: 100
    },
    { 
      field: 'dbb004Summary',
      cellRenderer: DataSummaryCellRenderer
    },
    { field: 'dbb013Summary' }
  ])

  const getRowId = (params: any) => params.data.year 

  const handleRowClick = ({ data }: RowClickedEvent) => {
    router.push(`/well-permits/${router.query.permitNumber}/${data.year}`)
  }

  const handleSubmit = (jumpToYear: string) => {
    router.push(`/well-permits/${router.query.permitNumber}/${jumpToYear}`)
    setYear(jumpToYear)
  }

  return (
    <div className="grid grid-cols-8 gap-6">
      <div className="ag-theme-alpine col-span-6" style={{ height: 265 }}>
        <AgGridReact
          ref={gridRef}
          onGridReady={onGridReady}
          rowData={rowData}
          defaultColDef={defaultColDef}
          columnDefs={columnDefs}
          rowSelection="single"
          onRowClicked={handleRowClick}
          suppressCellFocus={true}
          getRowId={getRowId}
        >
        </AgGridReact>
      </div>
      <YearPicker onSubmit={(year) => handleSubmit(year)} />
    </div>
  )
}

export default CalendarYearSelector