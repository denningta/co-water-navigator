import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material"
import useDbb004BankingSummary from "../../../hooks/useDbb004BankingSummary"
import useTailwindBreakpoints from "../../../hooks/useTailwindBreakpoints"
import { IoChevronDown } from "react-icons/io5"
import { ColDef, ICellRendererParams } from "ag-grid-community"
import { AgGridReact } from "ag-grid-react"
import styles from "./ModifiedBankingSummary.module.css"

interface Props {
  permitNumber: string | undefined
  year: string | undefined
}

const ModifiedBankingSummary = ({ permitNumber, year }: Props) => {
  const { data } = useDbb004BankingSummary(permitNumber, year)
  const breakpoint = useTailwindBreakpoints()

  const title = <div className="font-bold text-xl">Three Year Modified Banking Summary (from DBB-013)</div>

  const colDefs: ColDef[] = [
    {
      field: 'number',
      headerName: 'Value',
      maxWidth: 80,
      suppressMovable: true,
      editable: true,
    },
    {
      field: 'description',
      headerName: 'Description',
      minWidth: 400,
      suppressMovable: true,
    }

  ]

  const rowData = [
    { number: data?.allowedAppropriation, description: "Allowed annual appropriation per approved change" },
    { number: data?.pumpingLimitThisYear, description: "Allowed pumping this year with 3-year banking" },
    { number: data?.flowMeterLimit, description: "Flow meter limit" }
  ]

  const formContent = (
    <div className={`ag-theme-alpine`} style={{ height: 150, width: 500 }}>
      <AgGridReact
        columnDefs={colDefs}
        rowData={rowData}
        headerHeight={20}
        suppressRowClickSelection={true}
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
