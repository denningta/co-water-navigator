import { useUser } from '@auth0/nextjs-auth0';
import { ColDef, ColumnApi, GridApi, RowNode, SelectionChangedEvent, SetFilterModelValue } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import styles from './DataTable.module.css'
import { AgGridReact } from "ag-grid-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { IoIosArrowBack } from 'react-icons/io';
import ColumnSelector from './ColumnSelector';

interface Props {
  columnDefs: ColDef[]
  rowData: any[] | undefined
  height?: number
  filterModel?: { [key: string]: any; }
  rowSelection?: 'single' | 'multiple'
  suppressRowClickSelection?: boolean
  onRowSelectionChanged?: (rowNodes: RowNode[]) => void | null
}

const DataTable = ({ 
  columnDefs, 
  rowData, 
  height = 400, 
  filterModel, 
  rowSelection = 'multiple',
  suppressRowClickSelection = false,
  onRowSelectionChanged = () => null 
}: Props) => {
  const gridRef = useRef<AgGridReact>(null);
  const [api, setApi] = useState<GridApi | null>(null)
  const [columnApi, setColumnApi] = useState<ColumnApi | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [dynamicColDefs, setDynamicColDefs] = useState<ColDef[]>(columnDefs)

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true
    }
  }, [])

  const onGridReady = () => {
    if (!gridRef) return
    if (!gridRef.current?.api || !gridRef.current.columnApi) return
    setApi(gridRef.current.api)
    setColumnApi(gridRef.current.columnApi)
  }

  useEffect(() => {
    if (!api) return
    api.setFilterModel(filterModel)
    api.sizeColumnsToFit()
  }, [api, filterModel])

  const handleClick = () => {
    setExpanded(!expanded)
  }

  const handleColumnSelectionChange = (colDefs: ColDef[]) => {
    if (!gridRef || !gridRef.current?.api) return
    setDynamicColDefs(colDefs)
    gridRef.current?.api.setColumnDefs(columnDefs)
  }

  const handleRowSelectionChange = ({ api }: SelectionChangedEvent) => {
    onRowSelectionChanged(api.getSelectedNodes())
    api.redrawRows()
  }

  return (
    <div className='flex'>
      <div className="w-full ag-theme-alpine" style={{ height: height }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          defaultColDef={defaultColDef}
          columnDefs={columnDefs}
          pagination={true}
          onGridReady={onGridReady}
          rowSelection={rowSelection}
          onSelectionChanged={handleRowSelectionChange}
          suppressCellFocus={true}
          suppressRowClickSelection={suppressRowClickSelection}
        >
        </AgGridReact>
      </div>
      <div 
      className='border-t border-b border-gray-400 p-3 w-[40px] cursor-pointer'
      onClick={handleClick}>
        <button
          className="">
            <IoIosArrowBack className={`${expanded ? 'rotate-180' : 'rotate-0'} transition-all ease-in-out`} />
        </button>
        <div className="rotate-90 flex justify-start">Menu</div>
      </div>
      <div className={`${expanded ? 'w-[400px]' : 'w-[0px]'} transition-all ease-in-out overflow-x-hidden border-t border-r border-b border-gray-400`}
        style={{ height: height }}
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