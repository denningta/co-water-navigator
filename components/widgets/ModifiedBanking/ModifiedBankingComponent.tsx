import { useRef } from "react"
import { BsInfoLg } from "react-icons/bs"
import { ModifiedBanking } from "../../../interfaces/ModifiedBanking"
import { ModifiedBankingFormControls } from "./generatre-form-metadata"
import ModifiedBankingForm, { CellValueChangedEvent, ModifiedBankingFormApi } from "./ModifiedBankingForm"

interface Props {
  permitNumber: string | undefined
  year: string | undefined
  modifiedBankingData: ModifiedBanking
}

const ModifiedBankingComponent = ({ year, permitNumber, modifiedBankingData }: Props) => {
  const formRef = useRef<ModifiedBankingFormApi>(null)

  const handleCellValueChanged = async (
    event: CellValueChangedEvent, 
    formControl: ModifiedBankingFormControls,
    values: ModifiedBanking
  ) => {
    const body = {
      ...values,
      permitNumber: permitNumber,
      year: year,
      [formControl]: {
        ...event.newValue,
        source: 'user'
      }
    }
    if (event.newValue && event.newValue.value === '') delete body[formControl]

    await updateDatabase(body)
      .then(res => res)
      .catch(error => error)
  }

  const handleCommentsChanged = async (
    comments: string[], 
    formControl: ModifiedBankingFormControls,
    values: ModifiedBanking  
  ) => {
    const body = {
      ...values,
      permitNumber: permitNumber,
      year: year,
      [formControl]: {
        ...values[formControl],
        comments: comments
      }
    }

    await updateDatabase(body)
      .then(res => res)
      .catch(error => error)
  }

  const updateDatabase = async (body: any) => {
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

    if (!formRef && !res) return
    formRef.current?.setFormValues(res)
  }

  return (
    <div>
        <div className="flex items-center font-bold text-2xl mb-4">
          <div>Three Year Modified Banking (DBB-013)</div>
          <div className="grow"><span className="ml-8 mr-2 font-thin text-xl">CALENDAR YEAR</span> {year}</div>
      </div>
      { permitNumber && year &&
        <ModifiedBankingForm 
          ref={formRef}
          permitNumber={permitNumber} 
          year={year} 
          modifiedBankingData={modifiedBankingData}
          onCellValueChanged={handleCellValueChanged}
          onCommentsChanged={handleCommentsChanged}
        />
      }
    </div>
  )
}

export default ModifiedBankingComponent