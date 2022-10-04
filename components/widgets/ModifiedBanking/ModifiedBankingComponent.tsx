import axios from "axios"
import { useSnackbar } from "notistack"
import { useEffect, useRef, useState } from "react"
import { BsInfoLg } from "react-icons/bs"
import useModifiedBanking from "../../../hooks/useModifiedBanking"
import { ModifiedBanking } from "../../../interfaces/ModifiedBanking"
import FormWithCells, { FormElement } from "./FormWithCells"
import { generateFormElements } from "./generatre-form-elements"
import { generateFormMetaData, ModifiedBankingFormControls } from "./generatre-form-metadata"
import ModifiedBankingForm, { CellValueChangedEvent, ModifiedBankingFormApi } from "./ModifiedBankingForm"

interface Props {
  permitNumber: string | undefined
  year: string | undefined
}

const ModifiedBankingComponent = ({ year, permitNumber }: Props) => {
  const { data, mutate } = useModifiedBanking(permitNumber, year)
  const [formElements, setFormElements] = useState<FormElement[]>([])
  const [loading, setLoading] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (!year) return
    setFormElements(generateFormElements(year))
  }, [year])

  const handleCellValueChanged = async (
    event: CellValueChangedEvent, 
  ) => {
    try {
      setLoading(true)
      await mutate(updateDatabase(event.data), {
        rollbackOnError: true,
        revalidate: true
      })
      setLoading(false)
    } catch (error: any) {
      setLoading(false)
      enqueueSnackbar('Something went wrong', { variant: 'error' })
    }
  }

  const handleValueSetterError = (e: CellValueChangedEvent) => {
    enqueueSnackbar(`Input: "${e.newValue}" is not a number`, { variant: 'warning' })
  }

  const handleCommentsChanged = async (
    comments: string[], 
    formControl: ModifiedBankingFormControls,
    values: ModifiedBanking  
  ) => {

  }

  const updateDatabase = async (body: any) => {
    const url = `/api/v1/modified-banking/${permitNumber}/${year}`
    const res = await axios.patch(url, body)
    return res.data
  }

  return (
    <div>
        <div className="flex items-center font-bold text-2xl mb-4">
          <div>Three Year Modified Banking (DBB-013)</div>
          <div className="grow"><span className="ml-8 mr-2 font-thin text-xl">CALENDAR YEAR</span> {year}</div>
      </div>
      { year && 
        <FormWithCells 
          formElements={formElements} 
          data={data}
          onCellValueChanged={handleCellValueChanged}
          onValueSetterError={handleValueSetterError}
        /> 
      }
      {/* { permitNumber && year &&
        <ModifiedBankingForm 
          ref={formRef}
          permitNumber={permitNumber} 
          year={year} 
          modifiedBankingData={modifiedBankingData}
          // onCellValueChanged={handleCellValueChanged}
          onCommentsChanged={handleCommentsChanged}
        />
      } */}
    </div>
  )
}

export default ModifiedBankingComponent