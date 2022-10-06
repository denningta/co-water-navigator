import { Dialog, RadioGroup, FormControlLabel, FormGroup, Checkbox, Radio } from "@mui/material"
import CalendarYearSelector from "../CalendarYearSelector/CalendarYearSelector"
import { IoClose } from "react-icons/io5"
import Button from "../../common/Button"
import { TiExport } from "react-icons/ti"
import CustomRadio from "../../common/CustomRadio"
import { customColDefs, customDefaultColDefs } from "./custom-col-defs"
import React, { useEffect, useState } from "react"
import FileType from "./FileType"
import DocumentSelection, { DocumentSelectionObj } from "./DocumentSelection"
import { SelectionChangedEvent } from "ag-grid-community"


interface Props {
  open: boolean
  permitNumber: string | undefined
  year: string | undefined
  onClose?: () => void
}

const ExportDialog = ({ 
  open,
  permitNumber, 
  year,
  onClose = () => {}
}: Props) => {
  const [dataSelection, setDataSelection] = useState<any[]>()
  const [documents, setDocuments] = useState({
    dbb004: false,
    dbb013: false
  })
  const [fileType, setFileType] = useState('pdf')
  const [fileName, setFileName] = useState('')

  const handleClose = () => {
    onClose()
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
    const years = dataSelection?.map(el => el.year).slice(0, 5)
    setFileName(
      `${permitNumber}` +
      `${documents.dbb004 ? '_DBB-004' : ''}` +
      `${documents.dbb013 ? '_DBB-013' : ''}` +
      `_${years}` +
      `.${fileType}`
    )
  }, [documents, fileType, permitNumber, dataSelection])

  const handleExport = () => {
    console.log(fileType, documents, fileName, dataSelection)
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      fullWidth={true}
      maxWidth={'lg'}
    >
      <button className="absolute top-3 right-3" onClick={handleClose} type="button">
        <IoClose size={30} className="text-gray-400 hover:text-gray-600 transition ease-in-out" />
      </button>
      <div className="p-6">
        <div className="text-2xl font-bold mb-4 text-center">Export to PDF or CSV</div>
        <div className="mb-6">
          <div className="text-xl font-bold mb-2">Select years</div>
          <CalendarYearSelector 
            permitNumber={permitNumber} 
            year={year} 
            columnDefs={customColDefs}
            defaultColDef={customDefaultColDefs}
            rowSelection="multiple"
            onlyDataFilterDefault={true}
            onSelectionChanged={handleSelectionChanged}
          />
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
            <span className="mr-6">
              <Button title="Cancel" color="secondary" onClick={handleClose} />
            </span>
            <span>
              <Button title="Export..." icon={<TiExport />} onClick={handleExport} />
            </span>
          </div>
        </div>

      </div>
    </Dialog>
  )
}

export default ExportDialog