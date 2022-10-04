import { Tooltip } from "@mui/material"
import { IoMdClose } from "react-icons/io"
import { CellRendererParams } from "./FormWithCells"

const CellRendererComponent = ({ value, data, formControl, cellApi}: CellRendererParams) => {
  const handleClick = () => {
    if (!data || !formControl) return
    delete data[formControl]
    cellApi?.setCellValue('')
  }

  return (
    <span className="w-full flex">
      <span className="grow">  
        {value}
      </span>
      { formControl && data && data[formControl]?.source === 'user' &&
        <span>
          <Tooltip 
            title="Clear user defined value and re-calculate"
            enterDelay={1000}
            arrow={true}
          >
            <button 
              className="text-gray-500 cursor-pointer h-full" 
              type="button"
              onClick={handleClick}
            >
              <IoMdClose />
            </button>
          </Tooltip>
        </span>
      } 
    </span>
  )
}

export default CellRendererComponent