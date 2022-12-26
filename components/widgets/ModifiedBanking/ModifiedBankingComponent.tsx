import axios from "axios"
import { useSnackbar } from "notistack"
import { useEffect, useState } from "react"
import useModifiedBanking from "../../../hooks/useModifiedBanking"
import { ModifiedBanking } from "../../../interfaces/ModifiedBanking"
import FormWithCells, { CellValueChangedEvent, FormElement } from "./FormWithCells"
import { generateFormElements, ModifiedBankingFormControls } from "./generatre-form-elements"

interface Props {
  permitNumber: string | undefined
  year: string | undefined
  onCalculating?: (calculating: boolean | undefined) => void
}

const ModifiedBankingComponent = ({ 
  year, 
  permitNumber,
  onCalculating = () => {}
}: Props) => {
  const { data, mutate } = useModifiedBanking(permitNumber, year)
  const [formElements, setFormElements] = useState<FormElement[]>([])
  const [loading, setLoading] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (!year || !permitNumber) return
    setFormElements(generateFormElements(permitNumber, year))
  }, [year, permitNumber])

  const handleCellValueChanged = async (
    event: CellValueChangedEvent, 
  ) => {
    try {
      onCalculating(true)
      setLoading(true)
      await mutate(updateDatabase(event.data), {
        rollbackOnError: true,
        revalidate: true
      })
      setLoading(false)
      onCalculating(false)
    } catch (error: any) {
      setLoading(false)
      onCalculating(undefined)
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
    </div>
  )
}

export default ModifiedBankingComponent