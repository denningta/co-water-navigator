import { BaseSyntheticEvent, InputHTMLAttributes, useEffect, useState } from "react"
import { ModifiedBanking } from "../../../interfaces/ModifiedBanking"
import { FormMetaData, generateFormMetaData, ModifiedBankingFormControls } from "./generatre-form-metadata"
import { Formik, Form } from 'formik';
import Cell, { CellValueChangedEvent } from "./Cell";
import useKeyPress from "../../../hooks/useKeyPress";
import { ChangeEvent } from "react";
import { CalculatedValue } from "../../../interfaces/MeterReading";
import _ from "lodash";

interface Props {
  permitNumber: string | undefined
  year: string | undefined
  modifiedBankingData: ModifiedBanking | undefined
}


const ModifiedBankingForm = ({ 
  permitNumber, 
  year, 
  modifiedBankingData = {
    permitNumber: '',
    year: ''
  }
}: Props) => {
  const [formMetaData, setFormMetaData] = useState<FormMetaData[] | undefined>(undefined)

  useEffect(() => {
    if (!year) return
    setFormMetaData(generateFormMetaData(year))
  }, [year])

  const handleFormValidation = (values: any) => {
    const errors = {}
    return errors
  }

  const handleGetValue = (values: ModifiedBanking, formControl: ModifiedBankingFormControls) => {
    if (!values || !values[formControl] || !values[formControl]?.value) return ''
    return values[formControl]?.value.toString() ?? ''
  }

  const handleCellValueChanged = async (
    event: CellValueChangedEvent, 
    formControl: ModifiedBankingFormControls
  ) => {
    const body = {
      ...modifiedBankingData,
      permitNumber: permitNumber,
      year: year,
      [formControl]: event.newValue
    }
    if (event.newValue && event.newValue.value === '') delete body[formControl]

    const url = `/api/v1/modified-banking/${permitNumber}/${year}`
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .catch(error => error)
  }

  return (
    <div>
      <Formik
        initialValues={modifiedBankingData}
        enableReinitialize={true}
        validate={handleFormValidation}
        validateOnChange={true}
        onSubmit={() => {}}
      >
        {({
          values,
          errors,
          touched,
          setFieldValue
        }) => (
          <Form className="border">
            { formMetaData && formMetaData.map((element, i) => 
              <div key={i} className={`grid grid-cols-10 gap-x-6 min-h-[100px] bg-opacity-50 p-3 pr-6 ${i%2 === 1 ? 'bg-gray-200' : 'bg-gray-100'}`}>
                <div className="col-span-1 text-center flex justify-center items-center text-2xl font-bold">{ element.lineNumber }
                </div>
                <div className="col-span-6 flex flex-col justify-center">
                  <div className="font-bold">{ element.title }</div>
                  <div>{ element.description }</div>
                  <div>{ element.descriptionAlt }</div>
                </div>
                <div className="col-span-3 flex flex-col justify-center w-full">
                  <div className="text-sm font-thin mb-1">{ element.shortTitle }</div>
                  <Cell 
                    name={element.formControl}
                    value={handleGetValue(values, element.formControl)}
                    changeContext={{ 
                      values: values, 
                      formControl: element.formControl, 
                      setFieldValue: setFieldValue 
                    }}
                    onCellValueChanged={(event) => handleCellValueChanged(event, element.formControl)}
                  />
                </div>
              </div>
            )}
          </Form>
        )}
      </Formik>



    </div>
  )
}

export default ModifiedBankingForm