import { ColumnApi, GetRowIdFunc, GridApi, RowNode } from "ag-grid-community"
import axios from "axios"
import { useSnackbar } from "notistack"
import { useEffect, useState } from "react"
import useWellPermitByPermitNumber from "../../../hooks/useWellPermitByPermitNumber"
import { WellPermit } from "../../../interfaces/WellPermit"
import DataTable from "../DataTable/DataTable"
import colDefs from "./well-permit-records-manager-column-def"

interface WellPermitsRecordsManagerProps {
  permitNumber: string | undefined
  onSelectionChanged?: (data: WellPermit | undefined) => void
}

const WellPermitsRecordsManager = ({
  permitNumber,
  onSelectionChanged = () => { }
}: WellPermitsRecordsManagerProps) => {
  const { data, mutate } = useWellPermitByPermitNumber(permitNumber)
  const rowData = data?.records
  const [api, setApi] = useState<GridApi | undefined>(undefined)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (!data || !api) return
    const { selectedRecord } = data
    if (!selectedRecord) return

    if (selectedRecord.id) {
      api.getRowNode(selectedRecord.id)?.setSelected(true, true, true)
      onSelectionChanged(api.getRowNode(selectedRecord.id)?.data)
    }
  }, [data, api])

  const handleApiLoad = ({ api }: { api: GridApi }) => {
    setApi(api)
  }

  const handleRowSelectionChange = (rowNodes: RowNode<WellPermit>[]) => {
    onSelectionChanged(rowNodes[0]?.data)
    if (!rowNodes[0] || !rowNodes[0]?.data) return
    updateSelectedRecord(rowNodes[0].data)
  }

  const updateSelectedRecord = async (permitData: WellPermit) => {
    try {
      const key = `/api/v1/well-permits/permit/${permitNumber}`
      const res = await axios.patch(key, { selectedRecord: permitData })

      if (res) {
        enqueueSnackbar('Permit data successfully updated', { variant: 'success' })
        return
      }
      enqueueSnackbar('Something went wrong', { variant: 'error' })

    } catch (error: any) {
      enqueueSnackbar('Something went wrong', { variant: 'error' })
      throw new Error(error)
    }
  }

  const handleGetRowId: GetRowIdFunc = (params) => params.data.id


  return (
    <div>
      <DataTable
        rowData={rowData}
        columnDefs={colDefs}
        rowSelection="single"
        onRowSelectionChanged={handleRowSelectionChange}
        onApiLoad={handleApiLoad}
        getRowId={handleGetRowId}

      />
    </div>
  )
}


export default WellPermitsRecordsManager
