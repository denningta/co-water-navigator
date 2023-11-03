import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material"
import useDbb004BankingSummary from "../../../hooks/useDbb004BankingSummary"
import useTailwindBreakpoints from "../../../hooks/useTailwindBreakpoints"
import { IoChevronDown } from "react-icons/io5"
import { CellValueChangedEvent, ColDef, GridApi, ICellRendererParams, ValueSetterParams } from "ag-grid-community"
import { AgGridReact } from "ag-grid-react"
import { useRef, useState } from "react"
import { createCalculatedValueColDef } from "./readings-grid-colDefs"
import { useSnackbar } from "notistack"
import { useUser } from "@auth0/nextjs-auth0"
import { ModifiedBankingSummary, ModifiedBankingSummaryRow as Row } from "../../../interfaces/ModifiedBanking"
import axios from "axios"
import CalcValueCellRenderer from "./ModifiedBankingSummaryCellRenderer"


interface Props {
  permitNumber: string | undefined
  year: string | undefined
  onCalculating: (isCalculating: boolean) => void
}

const ModifiedBankingSummary = ({
  permitNumber,
  year,
  onCalculating = () => { }
}: Props) => {
  const { data } = useDbb004BankingSummary(permitNumber, year)
  const breakpoint = useTailwindBreakpoints()
  const gridRef = useRef<AgGridReact>(null)
  const { enqueueSnackbar } = useSnackbar()
  const { user } = useUser()
  const [gridApi, setGridApi] = useState<GridApi | null>(null)

  const handleGridReady = () => {
    if (!gridRef.current?.api) return
    setGridApi(gridRef.current.api)
    gridRef.current.api.sizeColumnsToFit()
  }

  const title = <div className="font-bold text-xl">Three Year Modified Banking Summary (from DBB-013)</div>

  const numberValidator = (params: ValueSetterParams) => {
    const test = isFinite(+params.newValue)
    if (!test) enqueueSnackbar('Invalid input: value must be a number', { variant: 'error' })
    return test;
  }

  const updateGridRows = (rowData: Row[]) => {
    rowData.forEach(record => {
      const rowNode = gridApi?.getRowNode(record.name)
      rowNode?.setData(record)
    })
  }

  const handleCellValueChange = async (event: CellValueChangedEvent<Row>) => {
    onCalculating(true)

    if (!permitNumber) throw new Error('permitNumber is undefined but required')
    if (!year) throw new Error('year is undefined by required')

    let gridData: Row[] = []

    event.api.forEachNode((node) => {
      node.data && gridData.push(node.data)
    })

    const updateData: ModifiedBankingSummary = {
      permitNumber: permitNumber,
      year: year,
      updatedBy: {
        name: user?.name,
        user_id: user?.sub
      },
      bankingData: gridData
    }

    const url = `/api/v1/data-summary/dbb004-banking-summary`
    try {
      const response = await axios.post<ModifiedBankingSummary>(url, updateData)

      debugger

      updateGridRows(response.data?.bankingData)



      onCalculating(false)
    } catch (error: any) {
      enqueueSnackbar(`Something went wrong. Try again.`, { variant: 'error' })
      onCalculating(false)
    }


  }

  const defaultColDef: ColDef = {
    editable: true
  }

  const colDefs: ColDef[] = [
    {
      ...createCalculatedValueColDef('value', numberValidator),
      cellRenderer: (params: ICellRendererParams) => CalcValueCellRenderer(params, 'value'),
    },
    {
      field: 'description',
      headerName: 'Description',
      minWidth: 400,
      suppressMovable: true,
      cellClass: 'bg-gray-500 bg-opacity-10',
      editable: false
    }
  ]



  const placeHolderData: Row[] = [
    {
      name: 'allowedAppropriation',
      description: 'Allowed annual appropriation per approved change',
    },
    {
      name: 'pumpingLimitThisYear',
      description: 'Allowed pumping this year with three year banking'
    },
    {
      name: 'flowMeterLimit',
      description: 'Water/power meter limit (assuming no break on record or meter changes)'
    },
  ]

  const rowData = placeHolderData.map(row => {
    return {
      ...row,
      value: data?.bankingData?.find(el => el.name === row.name)?.value
    }
  })

  const formContent = (
    <div className={`ag-theme-alpine`} style={{ height: 150, width: 550 }}>
      <AgGridReact
        ref={gridRef}
        onGridReady={handleGridReady}
        defaultColDef={defaultColDef}
        columnDefs={colDefs}
        rowData={rowData}
        headerHeight={20}
        onCellValueChanged={(event) => handleCellValueChange(event)}
        getRowId={(params) => params.data.name}
      />
    </div>

  )

  return (
    <div className="relative">
      {(breakpoint !== 'sm' && breakpoint !== 'md') ?
        <div className="space-y-2">
          <div>{title}</div>
          <div>{formContent}</div>
        </div>
        :
        <Accordion>
          <AccordionSummary
            expandIcon={<IoChevronDown />}
          >
            {title}
          </AccordionSummary>
          <AccordionDetails>
            {formContent}
          </AccordionDetails>
        </Accordion>
      }
    </div>
  )
}

export default ModifiedBankingSummary
