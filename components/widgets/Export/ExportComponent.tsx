import Button from "../../common/Button"
import { TiExport } from "react-icons/ti"
import { exportColDefs, exportDefaultColDefs } from "./exportColDefs"
import React, { useEffect, useRef, useState } from "react"
import FileType from "./FileType"
import DocumentSelection, { DocumentSelectionObj } from "./DocumentSelection"
import { ColumnApi, GridApi, GridReadyEvent, SelectionChangedEvent } from "ag-grid-community"
import axios from "axios"
import { DataSummary, useDataSummaryBySession } from "../../../hooks/useDataSummaryByPermit"
import { AgGridReact } from "ag-grid-react"
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { useSnackbar } from "notistack"
import QuickSearch from "../../common/QuickSearch"
import { useUser } from "@auth0/nextjs-auth0"


interface Props {
}

const ExportComponent = ({
}: Props) => {
  const [dataSelection, setDataSelection] = useState<DataSummary[]>([])
  const [documents, setDocuments] = useState({
    dbb004: false,
    dbb013: false
  })
  const [fileType, setFileType] = useState('pdf')
  const [blobUrl, setBlobUrl] = useState<string | undefined>(undefined)
  const { data, mutate } = useDataSummaryBySession()
  const { enqueueSnackbar } = useSnackbar()
  const [exportDisabled, setExportDisabled] = useState(true)
  const [quickFilter, setQuickFilter] = useState<string | undefined>(undefined)
  const gridRef = useRef<AgGridReact>(null);
  const [gridApi, setGridApi] = useState<GridApi | null>(null)
  const [columnApi, setColumnApi] = useState<ColumnApi | null>(null)
  const [isLoading, setIsLoading] = useState(false)


  const handleGridReady = ({ api, columnApi }: GridReadyEvent) => {
    api.sizeColumnsToFit()
    if (!gridRef.current) return
    if (api == null || columnApi == null) return
    setGridApi(api)
    setColumnApi(columnApi)
    api.sizeColumnsToFit()
  }

  const handleSelectionChanged = ({ api }: SelectionChangedEvent) => {
    setDataSelection(api.getSelectedRows())
  }

  const handleFileTypeChange = (input: string) => {
    setFileType(input)
  }

  const handleDocumentsChange = (documents: DocumentSelectionObj) => {
    setDocuments(documents)
  }

  const exportJson = () => {
    const json = JSON.stringify(dataSelection, null, 2);
    const file = new Blob([json], { type: 'text/json' })
    const url = URL.createObjectURL(file)
    window.open(url, '_blank')?.focus()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    setExportDisabled(!((documents.dbb004 || documents.dbb013) && dataSelection.length))
  }, [documents, dataSelection])

  const handleExport = async () => {
    setIsLoading(true)
    if (fileType === 'pdf') {
      try {
        const res = await axios.post(
          '/api/v1/export',
          {
            fileType: fileType,
            documents: documents,
            dataSelection: dataSelection
          }
        )
        renderInIframe(new Uint8Array(JSON.parse(res.data)))
        setIsLoading(false)
      } catch (error: any) {
        enqueueSnackbar('Something went wrong, please try again.', { variant: 'error' })
        setIsLoading(false)
      }
    } else if (fileType === 'json') {
      exportJson()
      setIsLoading(false)
    }
  }

  const renderInIframe = (pdfBytes: Uint8Array) => {
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    setBlobUrl(blobUrl)
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="text-xl font-bold mb-2">Select data to export</div>
        <div className="flex mb-4">
          <QuickSearch onChange={(value) => setQuickFilter(value)} />
        </div>
        <div className="ag-theme-alpine">
          <AgGridReact
            ref={gridRef}
            columnDefs={exportColDefs}
            defaultColDef={exportDefaultColDefs}
            rowData={data}
            suppressCellFocus={true}
            pagination={true}
            onGridReady={handleGridReady}
            rowSelection="multiple"
            onSelectionChanged={handleSelectionChanged}
            quickFilterText={quickFilter}
            domLayout="autoHeight"
            paginationPageSize={20}
          />
        </div>
      </div>
      <div className="flex">
        <div className="flex justify-center w-full">
          <div className="mb-6 mr-16 ml-6 min-w-fit">
            <FileType fileType={fileType} onChange={handleFileTypeChange} />
          </div>
          <div className="mb-6 mr-16 min-w-fit">
            <DocumentSelection documents={documents} onChange={handleDocumentsChange} />
          </div>
        </div>
        <div className="flex grow justify-end items-end">
          <span>
            <Button
              title="Export..."
              icon={<TiExport />}
              onClick={handleExport}
              disabled={exportDisabled}
              isLoading={isLoading}
            />
          </span>
        </div>
      </div>
      {blobUrl && <iframe
        src={blobUrl}
        itemType="application/pdf"
        className="w-full my-10 h-[1000px]"
      ></iframe>}
    </div>
  )
}

export default ExportComponent
