/* eslint-disable react-hooks/exhaustive-deps */
import React, { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import useFocus from "../../../hooks/useFocus"
import _ from "lodash"
import { CellRendererParams, CellValueChangedEvent } from "./FormWithCells"

export interface CellApi {
  setCellValue: (input: string) => void
  cursorToEnd: () => void
}

interface Props {
  value?: string | undefined
  focus?: boolean
  editing?: boolean
  className?: string
  label?: string | JSX.Element
  errorMessage?: string | JSX.Element
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
  onFocusClick?: (focusEvent: { state: boolean, detail: number }) => void
  onCellValueChanged?: (e: Omit<CellValueChangedEvent, 'data' | 'formControl'>) => void
  cellRendererComponent?: ((params: CellRendererParams) => JSX.Element | void) | undefined
}

const Cell = forwardRef((
  { 
    value = undefined, 
    focus = false,
    editing = false,
    className = '',
    label,
    errorMessage,
    onChange = () => {},
    onClick = () => {},
    onFocusClick = () => {},
    onCellValueChanged = () => {},
    cellRendererComponent = () => {},
  }: Props, 
  ref: React.ForwardedRef<CellApi>
) => {
  const cellRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const focusClick = useFocus(cellRef)
  const [oldValue, setOldValue] = useState<string | undefined>(value)
  const [newValue, setNewValue] = useState<string | undefined>(value)

  const setCellValue = (value: string, triggerCellChanged: boolean = true) => {
    setNewValue(value)
    if (triggerCellChanged) onCellValueChanged({ oldValue: oldValue, newValue: value })
  }

  const cursorToEnd = () => {
    setTimeout(() => {
      if (!inputRef.current) return
      inputRef.current.setSelectionRange(newValue?.length ?? 0, newValue?.length ?? 0)
    }, 10)
  }

  const cellApi: CellApi = {
    setCellValue: setCellValue,
    cursorToEnd: cursorToEnd
  }

  useImperativeHandle(ref, () => cellApi)

  useEffect(() => {
    if (value === undefined) return
    setNewValue(value)
  }, [value])

  useEffect(() => {
    onFocusClick(focusClick)
  }, [focusClick])

  useEffect(() => {
    if (editing) {
      setOldValue(newValue)
      setTimeout(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
      }, 10)
    }
    if (!editing) {
      if (oldValue === null) return
      if (!_.isEqual(oldValue, newValue)) {
        onCellValueChanged({ oldValue: oldValue, newValue: newValue })
      }
    }
  }, [editing])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewValue(event.target.value)
    onChange(event)
  }

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    onClick(event)
  }

  return (
    <div>
      {label && 
        <div>
          { label }
        </div>
      }
      <div
        ref={cellRef}
        onClick={handleClick}
        className={`h-[38px] w-full bg-white hover:bg-primary-500 hover:bg-opacity-10 ${focus ? 'outline outline-primary-500' : 'outline-none'} ${editing ? 'drop-shadow-lg' : 'drop-shadow-none'}`}>
        { !editing &&
          <div className={`w-full h-full px-3 flex items-center select-none ${className}`}>
            { cellRendererComponent({ value: newValue }) ?? newValue }
          </div>
        }
        { editing &&
          <input
            ref={inputRef}
            value={newValue ?? ''}
            className="bg-white h-[38px] w-full px-3 outline-none"
            onChange={handleChange}
            autoComplete="off"
          />
        }
      </div>
      {errorMessage && 
        <div>
          {errorMessage}
        </div>
      }
    </div>
  )
})

Cell.displayName = 'Cell'


export default Cell