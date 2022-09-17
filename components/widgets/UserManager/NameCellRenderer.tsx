import { Tooltip } from "@mui/material";
import { ICellRendererParams } from "ag-grid-community";
import Image from 'next/image'

const NameCellRenderer = (params: ICellRendererParams) => {
  return (
    <span className="flex items-center">
      {params.data.picture && 
        <Image 
          src={params.data.picture}
          alt='Profile picture'
          width={30}
          height={30}
          className="rounded-full overflow-hidden"
        />
      }
      <span className="ml-2">{ params.value }</span>
    </span>
  )
}

export default NameCellRenderer