import { Tooltip } from "@mui/material"
import { ICellRendererParams } from "ag-grid-community"
import { IoMdClose } from "react-icons/io"
import { CalculatedValue } from "../../../interfaces/MeterReading"

const CalcValueCellRenderer = (params: ICellRendererParams, colId: string) => {
  const { source, calculationState, calculationMessage }: CalculatedValue = params.data[colId] ?? {}

  const handleClick = async () => {
    if (!colId) return
    params.node.setDataValue(colId, '')
  }


  const clearButtonFields = [
    'value'
  ]

  return (
    <span className="flex items-center justify-center -mx-3 px-3">
      <Tooltip title={calculationMessage ?? ''} arrow={true}>
        <span className="grow">{params.value}</span>
      </Tooltip>
      {source === 'user' && clearButtonFields.includes(colId) &&
        <Tooltip
          title="Clear value and re-calculate"
          enterDelay={1000}
          arrow={true}
        >
          <button
            className="text-gray-500 cursor-pointer"
            type="button"
            onClick={handleClick}
          >
            <IoMdClose />
          </button>
        </Tooltip>
      }
    </span>

  )
}

export default CalcValueCellRenderer
