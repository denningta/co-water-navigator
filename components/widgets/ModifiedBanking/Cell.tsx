import React, { ChangeEvent, useEffect, useRef, useState } from "react"
import { Field } from 'formik'
import useFocus from "../../../hooks/useFocus"
import useKeyPress from "../../../hooks/useKeyPress"
import { ModifiedBankingFormControls } from "./generatre-form-metadata"
import { ModifiedBanking } from "../../../interfaces/ModifiedBanking"
import { CalculatedValue } from "../../../interfaces/MeterReading"
import _ from "lodash"

export type CellValueChangedEvent = {
  oldValue: any | undefined
  newValue: any | undefined
}

interface Props {
  value: string | undefined
  name: string | undefined
  changeContext: {
    values: ModifiedBanking,
    formControl: ModifiedBankingFormControls,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void
  }
  onCellValueChanged?: (e: CellValueChangedEvent) => void
}

const Cell = ({ 
  value, 
  name, 
  changeContext,
  onCellValueChanged = () => {}
}: Props) => {
  const cellRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const focus = useFocus(cellRef)
  const enterPressed = useKeyPress('Enter')
  const anyKeyPressed = useKeyPress()
  const [editing, setEditingState] = useState(false)
  const { values, formControl, setFieldValue } = changeContext
  const [oldCellValue, setOldCellValue] = useState<Object | undefined>(undefined)
  const [newCellValue, setNewCellValue] = useState<Object | undefined>(undefined)


  useEffect(() => {
    if (editing) {
      setOldCellValue(values[formControl])
      setNewCellValue(values[formControl])
    }
    if (!editing && !(_.isEqual(oldCellValue, newCellValue))) {
      onCellValueChanged({
        newValue: newCellValue,
        oldValue: oldCellValue
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing])

  useEffect(() => {
    if (!focus) setEditing(false)
  }, [focus])

  useEffect(() => {
    if (!enterPressed) return
    if (focus) {
      if (!editing) setEditing(true)
      if (editing) setEditing(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enterPressed])

  useEffect(() => {
    if (enterPressed && anyKeyPressed || !enterPressed && !anyKeyPressed) return
    if (focus) {
      if (!editing) setEditing(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anyKeyPressed])


  const setEditing = (editing: boolean) => {
    setEditingState(editing)
    setTimeout(() => inputRef.current?.focus(), 10)
  }

  const handleClick = ({ detail }: React.MouseEvent) => {
    if (detail === 2) {
      setEditing(true)
    }
  }

  const handleChange = (
    { target }: ChangeEvent<HTMLInputElement>, 
    values: ModifiedBanking,
    formControl: ModifiedBankingFormControls,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void
  ) => {
    const newValue = { ...values[formControl], value: target.value === '' ? '' : +target.value }
    setNewCellValue(newValue)
    setFieldValue(formControl, newValue)
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
          name={name}
          className="bg-white h-[38px] w-full px-3 outline-none"
          onChange={(event) => handleChange(event, values, formControl, setFieldValue)}
          autoComplete="off"
        /> 
      }
    </div>
  )
}

export default Cell