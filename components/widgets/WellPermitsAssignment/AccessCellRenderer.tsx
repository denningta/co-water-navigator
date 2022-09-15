import { Tooltip } from "@mui/material";
import { ICellRendererParams } from "ag-grid-community";
import { BsDot } from "react-icons/bs";
import { GrStatusGoodSmall } from 'react-icons/gr'

const AccessCellRenderer = (props: ICellRendererParams) => {
  let className = 'bg-violet-300 text-violet-700'
  if (props.value === 'approved') {
    className = 'bg-emerald-300 text-emerald-700'
  }

  const cellValue = props.value.charAt(0).toUpperCase() + props.value.slice(1)

  return (
    <span className={`rounded w-fit h-fit px-4 py-1 text-center font-semibold ${className}`} >
      { cellValue ?? 'Requested' }
    </span>
  )
}

export default AccessCellRenderer