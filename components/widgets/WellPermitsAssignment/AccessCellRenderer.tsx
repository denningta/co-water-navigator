import { Tooltip } from "@mui/material";
import { ICellRendererParams } from "ag-grid-community";
import { BsDot } from "react-icons/bs";
import { GrStatusGoodSmall } from 'react-icons/gr'

const AccessCellRenderer = (props: ICellRendererParams) => {
  let className = 'bg-violet-300 text-violet-700'
  if (props.value === 'approved') className = 'bg-success-300 text-success-700'
  if (props.value === 'rejected') className = 'bg-error-300 text-error-700'

  const cellValue = props.value 
    ? props.value.charAt(0).toUpperCase() + props.value.slice(1)
    : undefined

  return (
    <>
      { cellValue && 
        <span className={`rounded w-fit h-fit px-4 py-1 text-center font-semibold ${className}`} >
          { cellValue ?? 'Requested' }
        </span>
      }
    </>

  )
}

export default AccessCellRenderer