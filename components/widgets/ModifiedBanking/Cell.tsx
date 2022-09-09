import React, { useEffect, useRef, useState } from "react"
import { Field } from 'formik'
import useFocus from "../../../hooks/useFocus"
import useKeyPress from "../../../hooks/useKeyPress"

interface Props {
  value: string | undefined
  name: string | undefined
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Cell = ({ value, name, onChange = () => {} }: Props) => {
  const cellRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const focus = useFocus(cellRef)
  const enterPressed = useKeyPress('Enter')
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    if (!focus) setEditing(false)
  }, [focus])

  useEffect(() => {
    if (!enterPressed) return
    if (focus) {
      if (!editing) {
        setEditing(true)
        setTimeout(() => inputRef.current?.focus(), 10)
      }
      if (editing) {
        setEditing(false)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enterPressed])

  const handleClick = ({ detail }: React.MouseEvent) => {
    if (detail === 2) {
      setEditing(true)
      setTimeout(() => inputRef.current?.focus(), 10)
    }
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
          onChange={onChange}
          autoComplete="off"
        /> 
      }
    </div>
  )
}

export default Cell