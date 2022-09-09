import { BaseSyntheticEvent, InputHTMLAttributes, useEffect, useState } from "react"
import { ModifiedBanking } from "../../../interfaces/ModifiedBanking"
import { FormMetaData, generateFormMetaData, ModifiedBankingFormControls } from "./generatre-form-metadata"
import { Formik, Form } from 'formik';
import Cell from "./Cell";
import useKeyPress from "../../../hooks/useKeyPress";
import { ChangeEvent } from "react";


interface Props {
  permitNumber: string | undefined
  year: string | undefined
  modifiedBankingData: ModifiedBanking
}


const ModifiedBanking = ({ 
  permitNumber, 
  year, 
  modifiedBankingData = {
    permitNumber: '',
    year: ''
  }
}: Props) => {
  const [formMetaData, setFormMetaData] = useState<FormMetaData[] | undefined>(undefined)
  const enterPressed = useKeyPress('Enter')

  useEffect(() => {
    if (!year) return
    setFormMetaData(generateFormMetaData(year))
  }, [year])

  const handleFormValidation = (values: any) => {
    const errors = {}
    return errors
  }

  const handleGetValue = (values: ModifiedBanking, formControl: ModifiedBankingFormControls) => {
    if (!values && !values[formControl]) return ''
    return values[formControl]?.value.toString() ?? ''
  }

  const handleChange = (
    { target }: ChangeEvent<HTMLInputElement>, 
    values: ModifiedBanking,
    formControl: ModifiedBankingFormControls,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void
  ) => {
    setFieldValue(formControl, { ...values, value: target.value })
  }

  return (
    <div>
      <div className="font-bold text-2xl mb-4">
        Three Year Modified Banking (DBB-013)
        <span className="ml-8 mr-1 font-thin text-xl">CALENDAR YEAR</span> {year}
      </div>

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
          <Form>
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
                    onChange={(event) => handleChange(event, values, element.formControl, setFieldValue)}
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

export default ModifiedBanking