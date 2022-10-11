import Button from "../../common/Button"
import { TiExport } from "react-icons/ti"
import { exportColDefs, exportDefaultColDefs } from "./exportColDefs"
import React, { useEffect, useRef, useState } from "react"
import FileType from "./FileType"
import DocumentSelection, { DocumentSelectionObj } from "./DocumentSelection"
import { GridReadyEvent, SelectionChangedEvent } from "ag-grid-community"
import axios from "axios"
import { useDataSummaryTotal } from "../../../hooks/useDataSummaryByPermit"
import { AgGridReact } from "ag-grid-react"
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS


interface Props {
}

const ExportComponent = ({ 
}: Props) => {
  const [dataSelection, setDataSelection] = useState<any[]>()
  const [documents, setDocuments] = useState({
    dbb004: false,
    dbb013: false
  })
  const [fileType, setFileType] = useState('pdf')
  const [fileName, setFileName] = useState('')
  const [blobUrl, setBlobUrl] = useState<string | undefined>(undefined)
  const { data, mutate } = useDataSummaryTotal()
  const gridRef = useRef(null)

  const handleGridReady = ({ api, columnApi }: GridReadyEvent) => {
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

  const handleFileNameChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(target.value)
  }

  useEffect(() => {
    const permitNumbers = (dataSelection && dataSelection.length > 0) 
      ? dataSelection.map(el => 
        el.permitNumber
      ).filter((item, i, array) => 
        array.indexOf(item) === i
      )
      : ''

    setFileName(
      `${permitNumbers}` +
      `${documents.dbb004 ? '_DBB-004' : ''}` +
      `${documents.dbb013 ? '_DBB-013' : ''}` +
      `.${fileType}`
    )
  }, [documents, fileType, dataSelection])

  const handleExport = async () => {
    try {
      const res = await axios.post(
        '/api/v1/export',
        {
          fileType: fileType,
          documents: documents,
          fileName: fileName,
          dataSelection: dataSelection
        }
      )
      renderInIframe(new Uint8Array(JSON.parse(res.data)))
    } catch (error: any) {

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
          <div className="ag-theme-alpine" style={{ height: 300 }}>
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
            <div className="mb-6 flex flex-col w-full mr-16">
              <label className="mb-1 text-xl font-bold">File name</label>
              <input
                value={fileName}
                onChange={handleFileNameChange}
                className="bg-gray-100 outline-primary border border-gray-300 py-2 px-3 rounded"
              />
            </div>
          </div>
          <div className="flex grow justify-end items-end">
            <span>
              <Button title="Export..." icon={<TiExport />} onClick={handleExport} />
            </span>
          </div>
        </div>
        <iframe 
          src={blobUrl}
          itemType="application/pdf"
          className="w-full my-10 h-[1000px]"
        ></iframe>
      </div>
  )
}

export default ExportComponent