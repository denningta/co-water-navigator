/* eslint-disable react-hooks/exhaustive-deps */
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { ModifiedBanking } from "../../../interfaces/ModifiedBanking"
import { FormMetaData, generateFormMetaData, ModifiedBankingFormControls } from "./generatre-form-metadata"
import { FormikErrors, useFormik } from 'formik';
import Cell from "./Cell";
import useKeyPress from "../../../hooks/useKeyPress";
import { ChangeEvent } from "react";
import _ from "lodash";
import useFocus from "../../../hooks/useFocus";

export type CellValueChangedEvent = {
  oldValue: any | undefined
  newValue: any | undefined
}

export interface ModifiedBankingFormApi {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void> | Promise<FormikErrors<ModifiedBanking>>
  setFormValues: (data: ModifiedBanking) => void
}

interface Props {
  permitNumber: string
  year: string
  modifiedBankingData: ModifiedBanking | undefined,
  onCellValueChanged?: (e: CellValueChangedEvent, formControl: ModifiedBankingFormControls) => void
}
const ModifiedBankingForm = forwardRef((props: Props, ref: ForwardedRef<ModifiedBankingFormApi>) => {
  const { 
    permitNumber, 
    year, 
    modifiedBankingData = { permitNumber: '', year: '' }, 
    onCellValueChanged = () => {}
  } = props
  const [formMetaData] = useState<FormMetaData[]>(generateFormMetaData(year))
  const containerRef = useRef<HTMLDivElement>(null)
  const containerFocus = useFocus(containerRef)
  const [focusIndex, setFocusIndex] = useState<number | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const arrowDown = useKeyPress('ArrowDown')
  const arrowUp = useKeyPress('ArrowUp')
  const tab = useKeyPress('Tab')
  const shift = useKeyPress('Shift')
  const enter = useKeyPress('Enter')

  const handleFormValidation = (values: any) => {
    const errors = {}
    return errors
  }

  const { values, setFieldValue } = useFormik({
    initialValues: modifiedBankingData,
    enableReinitialize: true,
    validate: handleFormValidation,
    validateOnChange: true,
    onSubmit: () => {},
  })

  const setFormValues = (data: ModifiedBanking) => {
    formMetaData.forEach(el => {
      setFieldValue(el.formControl, data[el.formControl])
    })
  }

  const formApi: ModifiedBankingFormApi = {
    setFieldValue: setFieldValue,
    setFormValues: setFormValues
  }

  useImperativeHandle(ref, () => formApi)

  useEffect(() => {
    if (!containerFocus) setFocusIndex(null)
  }, [containerFocus])

  useEffect(() => {
    if (!containerFocus) return
    arrowDown.event?.preventDefault()
    arrowUp.event?.preventDefault()
    tab.event?.preventDefault()
    shift.event?.preventDefault()
    if (!formMetaData) return
    if (arrowDown.pressed) {
      let newIndex = focusIndex !== null ? focusIndex + 1 : 0
      if (newIndex >= (formMetaData.length - 1)) newIndex = (formMetaData.length - 1)
      setFocusIndex(newIndex)
    }
    if (arrowUp.pressed) {
      let newIndex = focusIndex !== null ? focusIndex - 1 : 0
      if (newIndex <= 0) newIndex = 0
      setFocusIndex(newIndex)
    }
    if (tab.pressed && !shift.pressed) {
      let newIndex = focusIndex !== null ? focusIndex + 1 : 0
      if (newIndex >= (formMetaData.length)) newIndex = 0
      setFocusIndex(newIndex)
    }
    if (tab.pressed && shift.pressed) {
      let newIndex = focusIndex !== null ? focusIndex - 1 : 0
      if (newIndex < 0) newIndex = formMetaData.length - 1
      setFocusIndex(newIndex)
    }
  }, [arrowDown, arrowUp, tab])

  useEffect(() => {
    if (!containerFocus) return
    enter.event?.preventDefault()
    if (enter.pressed) setEditingIndex(editingIndex === null ? focusIndex : null)
  }, [enter])

  const handleCellClick = (clicked: boolean, index: number) => {
    if (!clicked) {
      setFocusIndex(null)
      setEditingIndex(null)
    }
    if (clicked) {
      setTimeout(() => setFocusIndex(index), 1)
    }
  }

  const handleChange = (
    { target }: ChangeEvent<HTMLInputElement>, 
    formControl: ModifiedBankingFormControls,
  ) => {
    setFieldValue(formControl, cellValueSetter(target.value, formControl))
  }

  const cellValueGetter = (formControl: ModifiedBankingFormControls) => {
    if (!values || !values[formControl] || !values[formControl]?.value) return ''
    return values[formControl]?.value.toString() ?? ''
  }

  const cellValueSetter = (value: string, formControl: ModifiedBankingFormControls) => {
    return { 
      ...values[formControl], 
      value: value === '' ? '' : +value
    }
  }

  const handleCellValueChanged = (event: CellValueChangedEvent, formControl: ModifiedBankingFormControls) => {
    onCellValueChanged(
      { 
        oldValue: cellValueSetter(event.oldValue, formControl),
        newValue: cellValueSetter(event.newValue, formControl)
      }, 
      formControl
    )
  }


  return (
    <div ref={containerRef}>
      <form className="border">
        {formMetaData && formMetaData.map(
          ({ lineNumber, title, description, descriptionAlt, shortTitle, formControl }, i) => 
          <div key={i} className={`grid grid-cols-10 gap-x-6 min-h-[100px] bg-opacity-50 p-3 pr-6 ${i%2 === 1 ? 'bg-gray-200' : 'bg-gray-100'}`}>
            <div className="col-span-1 text-center flex justify-center items-center text-2xl font-bold">
              { lineNumber }
            </div>
            <div className="col-span-6 flex flex-col justify-center">
              <div className="font-bold">{ title }</div>
              <div>{ description }</div>
              <div>{ descriptionAlt }</div>
            </div>
            <div className="col-span-3 flex flex-col justify-center w-full">
              <div className="text-sm font-thin mb-1">{ shortTitle }</div>
              <Cell 
                value={cellValueGetter(formControl)}
                onChange={(e) => handleChange(e, formControl)}
                onFocusClick={(clicked) => handleCellClick(clicked, i)}
                focus={focusIndex === i}
                editing={editingIndex === i}
                onCellValueChanged={(e) => handleCellValueChanged(e, formControl)}
              />
            </div>
          </div>
        )}
      </form>
    </div>
  )
})

ModifiedBankingForm.displayName = 'ModifiedBankingForm'

export default ModifiedBankingForm