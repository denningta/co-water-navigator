import { Tooltip } from "@mui/material";
import { ColDef, IHeaderParams } from "ag-grid-community";
import { useEffect, useState } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

const CalcValueHeaderRenderer = ({ displayName, api, column }: IHeaderParams) => {
  const [decimals, setDecimals] = useState(2)

  const handleSubtract = () => {
    if (decimals <= 0) return
    setDecimals(decimals - 1)
  }

  const handleAdd = () => {
    if (decimals >= 4) return
    setDecimals(decimals + 1)
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 mt-2">{ displayName }</div>
      <div className="absolute bottom-1">
        <Tooltip title="decimal places">
          <div className="flex w-full justify-center items-center text-gray-500 mt-2">
            <BsChevronLeft onClick={handleSubtract} className="cursor-pointer" />
            <span className="mx-3">{decimals}</span>
            <BsChevronRight onClick={handleAdd} className="cursor-pointer"/>
          </div>
        </Tooltip>
      </div>
    </div>
  )
}

export default CalcValueHeaderRenderer