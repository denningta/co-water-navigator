import { CellRendererComponent } from "ag-grid-community/dist/lib/components/framework/componentTypes"
import React, { useEffect, useMemo, useRef } from "react"
import useCellNavigation from "../../../hooks/useCellNavigation"
import AddCommentButton from "./AddCommentButton"
import Cell, { CellApi } from "./Cell"
import Form from "./Form"
import { FormMetaData, generateformMetaData } from "./generatre-form-elements"

export type CellValueChangedEvent = {
  formControl: string
  oldValue: any | undefined
  newValue: any | undefined
  data: any
}

export interface ValueGetterParams {
  data: {
    [formControl: string]: any
  }
  formControl: string
}

export interface ValueSetterParams {
  data: {
    [formControl: string]: any
  }
  formControl: string
  newValue: string
  oldValue: string
}

export interface ValidatorParams {
  data: {
    [formControl: string]: any
  }
  formControl: string
  newValue: string
  oldValue: string
}

export type CellClassParams = ValueGetterParams

export interface CellRendererParams {
  value: string | undefined
  data?: {
    [formControl: string]: any
  }
  formControl?: string
  cellApi?: CellApi | null
}

export interface FormRendererParams {
  formMetadata: FormMetaData,
}

export interface FormElement {
  formMetadata: FormMetaData
  formControl: string
  formComponent?: (params: FormRendererParams) => (JSX.Element | void)
  cellLabel?: string
  cellRendererComponent?: (params: CellRendererParams) => (JSX.Element | void)
  valueGetter?: (params: ValueGetterParams) => string
  valueSetter?: (params: ValueSetterParams) => boolean
  cellClass?: (params: CellClassParams) => string
}

interface Props {
  formElements?: FormElement[]
  data?: {
    [formControl: string]: any
  }
  onCellValueChanged?: (e: CellValueChangedEvent) => void
  onValueSetterError?: (e: CellValueChangedEvent) => void
}

const FormWithCells = ({
  formElements = [],
  data = {},
  onCellValueChanged = () => {},
  onValueSetterError = () => {},
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { 
    focusIndex,
    editingIndex,
    handleCellClick
  } = useCellNavigation(containerRef, formElements.length)
  
  const cellRefs = useRef<Array<CellApi | null>>([])

  const handleCellValueChanged = (
    e: CellValueChangedEvent, 
    index: number,
    valueSetter: ((params: ValueSetterParams) => boolean) | undefined
  ) => {
    if (valueSetter) {
      const setterResult = valueSetter(e)
      if (setterResult) {
        onCellValueChanged(e)
      } else {
        onValueSetterError(e)
        cellRefs.current[index]?.setCellValue(e.oldValue)
      }
    } else {
      e.data[e.formControl] = e.newValue
      onCellValueChanged(e)
    }
  }

  return (
    <div ref={containerRef}>
      {formElements.map((
        {
          formMetadata,
          formControl, 
          formComponent = (params) => {}, 
          cellLabel, 
          valueGetter, 
          valueSetter,
          cellClass,
          cellRendererComponent = (params) => {},
        }, 
        i
      ) =>
        <div key={i} 
          className={`
            grid grid-cols-6 
            h-fit py-[1px]
            ${i%2 === 1 ? 'bg-gray-200' : 'bg-gray-100'}
          `}
        >
          <div className="col-span-4">
            <Form formMetadata={formMetadata} customFormRenderer={(params) => formComponent(params)} />
          </div>

          <div className="col-span-2 px-4 flex items-center">
            <div className="grow">
              <Cell
                ref={(el: CellApi) => cellRefs.current[i] = el}
                value={valueGetter ? valueGetter({ data, formControl }) : data[formControl]}
                label={<CellLabel label={cellLabel ?? ''} />}
                errorMessage={<ErrorMessage message={(data && data[formControl]?.calculationMessage) ?? ''} />}
                className={cellClass ? cellClass({ data, formControl }) : ''}
                focus={focusIndex === i}
                editing={editingIndex === i}
                onFocusClick={(focusState) => handleCellClick(focusState, i)}
                onCellValueChanged={(e) => handleCellValueChanged(
                  { ...e, data: data, formControl: formControl },
                  i,
                  valueSetter
                )}
                cellRendererComponent={(params) => cellRendererComponent(
                  { ...params, data: data, formControl: formControl, cellApi: cellRefs.current[i] }
                )}
              />
            </div>
            <AddCommentButton comments={[]} onCommentsChange={() => {}} />
          </div>
        </div>
      )}
    </div>
  )

}

const CellLabel = ({ label }: {label: string}) => {
  return <span className="font-thin text-sm mb-1">{label}</span>
}

const ErrorMessage = ({ message }: {message: string}) => {
  return (
    <div className="h-[17px] text-sm mt-1 text-orange-500">
      { message }
    </div>
  )
}

export default FormWithCells