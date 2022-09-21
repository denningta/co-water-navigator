import { Tooltip } from "@mui/material";
import { ICellRendererParams } from "ag-grid-community";
import Image from 'next/image'
import Link from "next/link";

const PermitCellRenderer = (params: ICellRendererParams) => {
  return (
    <Link 
      href={`/well-permits/${params.value}`}
    >
      <span className="flex items-center cursor-pointer hover:underline hover:text-blue-500">
        { params.value }
      </span>
    </Link>
  )
}

export default PermitCellRenderer