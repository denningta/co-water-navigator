/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react"
import useFocus from "../../../hooks/useFocus"
import _ from "lodash"
import { CellValueChangedEvent } from "./ModifiedBankingForm"

interface Props {
  value?: string | undefined
  focus?: boolean
  editing?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
  onFocusClick?: (clicked: boolean) => void
  onCellValueChanged?: (e: CellValueChangedEvent) => void
}

const Cell = ({ 
  value = '', 
  focus = false,
  editing = false,
  onChange = () => {},
  onClick = () => {},
  onFocusClick = () => {},
  onCellValueChanged = () => {}
}: Props) => {
  const cellRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const focusClick = useFocus(cellRef)
  const [oldValue, setOldValue] = useState<string | null>(null)


  useEffect(() => {
    onFocusClick(focusClick)
  }, [focusClick])

  useEffect(() => {
    if (editing) {
      setOldValue(value)
      setTimeout(() => inputRef.current?.focus(), 10)
    }
    if (!editing) {
      if (oldValue === null) return
      if (!_.isEqual(oldValue, value)) {
        onCellValueChanged({ oldValue: oldValue, newValue: value })
      }
    }
  }, [editing])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event)
  }

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    onClick(event)
  }

  return (
    <div
      ref={cellRef} 
      onClick={handleClick} 
      className={`h-[38px] w-full bg-white hover:bg-primary hover:bg-opacity-10 ${focus ? 'outline outline-primary' : 'outline-none'} ${editing ? 'drop-shadow-lg' : 'drop-shadow-none'}`}>
      { !editing && 
        <div className="w-full h-full px-3 flex items-center select-none">{value}</div> 
      }
      { editing && 
        <input
          ref={inputRef}
          value={value}
          className="bg-white h-[38px] w-full px-3 outline-none"
          onChange={handleChange}
          autoComplete="off"
        /> 
      }
    </div>
  )
}

export default Cell