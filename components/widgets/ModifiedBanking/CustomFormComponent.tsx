import { FormControl, FormControlLabel, FormGroup, Radio, RadioGroup } from "@mui/material"
import axios from "axios"
import { useSnackbar } from "notistack"
import React, { useEffect, useState } from "react"
import useModifiedBanking from "../../../hooks/useModifiedBanking"
import { FormRendererParams } from "./FormWithCells"


const CustomFormComponent = ({ formMetadata }: FormRendererParams) => {
  const { lineNumber, title, description, descriptionAlt, permitNumber, year } = formMetadata
  const [selection, setSelection] = useState('b')
  const { data, mutate } = useModifiedBanking(permitNumber, year)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    setSelection(data?.line6Option ?? 'b')
  }, [data])

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value
    setSelection(value)
    updateDatabase({ 
      ...data,
      line6Option: value 
    })
  };

  const updateDatabase = async (body: any) => {
    try {
      const url = `/api/v1/modified-banking/${permitNumber}/${year}`
      const res = await axios.patch(url, body)
    } catch (error: any) {
      enqueueSnackbar('Something went wrong.  Please try again.', { variant: 'error' })
    }

  }

  if (lineNumber === 6) {
    return (
      <div className="flex items-center min-h-[100px]">
        <div className="h-full w-full max-w-[100px] font-bold text-2xl text-center">
          {lineNumber}
        </div>
        <div className="">
          <div className="font-bold">{title}</div>
          <FormControl>
            <RadioGroup 
              onChange={handleFormChange}
              value={selection}
            >
              <FormControlLabel value="a" control={<Radio />} label={description} />
              <FormControlLabel value="b" control={<Radio />} label={descriptionAlt} />
            </RadioGroup>
          </FormControl>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center min-h-[100px]">
      <div className="h-full w-full max-w-[100px] font-bold text-2xl text-center">
        {lineNumber}
      </div>
      <div className="">
        <div className="font-bold">{title}</div>
        <div className="">{description}</div>
        {descriptionAlt && 
          <div>{descriptionAlt}</div>
        }
      </div>
    </div>
  )
}

export default CustomFormComponent