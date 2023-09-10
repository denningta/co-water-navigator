import { useUser } from '@auth0/nextjs-auth0';
import { ColDef, ColumnApi, GetRowIdFunc, GridApi, RowNode, SelectionChangedEvent, SetFilterModelValue } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import styles from './DataTable.module.css'
import { AgGridReact } from "ag-grid-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { IoIosArrowBack } from 'react-icons/io';
import ColumnSelector from './ColumnSelector';
import LoadingOverlay from './LoadingOverlay';

interface Props {
  columnDefs: ColDef[]
  defaultColDef?: ColDef
  rowData: any[] | undefined
  height?: number
  filterModel?: { [key: string]: any; }
  rowSelection?: 'single' | 'multiple'
  suppressRowClickSelection?: boolean
  quickFilter?: string | undefined
  paginationPageSize?: number
  domLayout?: 'normal' | 'autoHeight' | 'print'
  noRowsComponent?: () => JSX.Element
  onRowSelectionChanged?: (rowNodes: RowNode[], api: GridApi) => void | null
  onApiLoad?: ({ api, columnApi }: { api: GridApi, columnApi: ColumnApi }) => void
  getRowId?: GetRowIdFunc
}

const DataTable = ({
  columnDefs,
  defaultColDef,
  rowData,
  height = 400,
  filterModel,
  rowSelection = 'multiple',
  suppressRowClickSelection = false,
  quickFilter,
  paginationPageSize = 20,
  domLayout = 'autoHeight',
  noRowsComponent,
  onRowSelectionChanged = () => null,
  onApiLoad = () => { },
  getRowId
}: Props) => {
  const gridRef = useRef<AgGridReact>(null);
  const [api, setApi] = useState<GridApi | null>(null)
  const [columnApi, setColumnApi] = useState<ColumnApi | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [dynamicColDefs, setDynamicColDefs] = useState<ColDef[]>(columnDefs)

  const onGridReady = () => {
    if (!gridRef) return
    if (!gridRef.current?.api || !gridRef.current.columnApi) return
    setApi(gridRef.current.api)
    setColumnApi(gridRef.current.columnApi)
    onApiLoad({ api: gridRef.current.api, columnApi: gridRef.current.columnApi })
  }

  useEffect(() => {
    if (!api) return
    api.setFilterModel(filterModel)
    api.sizeColumnsToFit()
  }, [api, filterModel])

  useEffect(() => {
    if (!api) return
    if (quickFilter === undefined)
      api.resetQuickFilter()
    else
      api.setQuickFilter(quickFilter)
  }, [api, quickFilter])

  useEffect(() => {
    if (!api) return
    if (!rowData) api.showLoadingOverlay()
    if (rowData) {
      if (rowData.length < 1) api.showNoRowsOverlay()
      else api.hideOverlay()
    }
  }, [api, rowData])

  const handleClick = () => {
    setExpanded(!expanded)
  }

  const handleColumnSelectionChange = (colDefs: ColDef[]) => {
    if (!gridRef || !gridRef.current?.api) return
    setDynamicColDefs(colDefs)
    gridRef.current?.api.setColumnDefs(columnDefs)
  }

  const handleRowSelectionChange = ({ api }: SelectionChangedEvent) => {
    onRowSelectionChanged(api.getSelectedNodes(), api)
    api.redrawRows()
  }

  return (
    <div className='flex'>
      <div className="w-full ag-theme-alpine">
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          defaultColDef={defaultColDef}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={paginationPageSize}
          onGridReady={onGridReady}
          rowSelection={rowSelection}
          onSelectionChanged={handleRowSelectionChange}
          suppressCellFocus={true}
          suppressRowClickSelection={suppressRowClickSelection}
          loadingOverlayComponent={LoadingOverlay}
          noRowsOverlayComponent={noRowsComponent}
          domLayout={domLayout}
          getRowId={getRowId}
        >
        </AgGridReact>
      </div>
      <div
        className='border-t border-b border-gray-400 w-0 hidden md:block md:p-3 md:w-[40px] cursor-pointer'
        onClick={handleClick}>
        <button
          className="">
          <IoIosArrowBack className={`${expanded ? 'rotate-180' : 'rotate-0'} transition-all ease-in-out`} />
        </button>
        <div className="rotate-90 flex justify-start">Menu</div>
      </div>
      <div className={`${expanded ? 'w-[400px]' : 'w-[0px]'} h-auto max-h-fit transition-all ease-in-out overflow-x-hidden border-t border-r border-b border-gray-400 overflow-y-auto`}
      >
        <ColumnSelector
          columnDefs={dynamicColDefs}
          expanded={expanded}
          selectionChanged={(colDefs) => handleColumnSelectionChange(colDefs)}
        />
      </div>
    </div>
  )
}

export default DataTable
