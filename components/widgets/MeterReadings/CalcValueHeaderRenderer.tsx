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
      <div className="my-2">{ displayName }</div>
    </div>
  )
}

export default CalcValueHeaderRenderer