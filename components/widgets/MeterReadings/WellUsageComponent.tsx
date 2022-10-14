import { Checkbox, FormControlLabel, FormGroup } from "@mui/material"
import axios from "axios"
import { useSnackbar } from "notistack"
import React, { useState } from "react"
import { FaLastfmSquare } from "react-icons/fa"
import useWellUsage from "../../../hooks/useWellUsage"
import { WellUsage } from "../../../interfaces/ModifiedBanking"

interface Props {
  permitNumber: string | undefined
  year: string | undefined
}

const defaultWellUsage: WellUsage = {
  expandedAcres: false,
  commingledWells: false,
  changeOfUse: false,
  other: false,
}

const WellUsageComponent = ({permitNumber, year}: Props) => {
  const { data, mutate } = useWellUsage(permitNumber, year)
  const { enqueueSnackbar } = useSnackbar()
  const handleChange = async (
    { target }: React.ChangeEvent<HTMLInputElement>, 
    key: keyof typeof data
  ) => {
    const optimisticData = {
      ...defaultWellUsage,
      ...data,
      [key]: target.checked,
      permitNumber: permitNumber,
      year: year
    }

    try {
      await mutate(updateWellUsage(optimisticData), {
        optimisticData: optimisticData,
        rollbackOnError: true,
        populateCache: true,
        revalidate: false
      })
    } catch (error: any) {
      enqueueSnackbar('Something went wrong.', { variant: 'error' })
    }
  }

  const updateWellUsage = async (data: WellUsage) => {
    try {
      const res = await axios.post(
        '/api/v1/well-usage',
        data
      )
      return res.data
    } catch (error: any) {
      throw new Error(error)
    }
  }

  return (
    <div className="mx-4">
      <div className="font-bold text-xl">Well Usage</div>
        <FormGroup className="ml-5">
          <FormControlLabel 
            control={
              <Checkbox
                disableRipple={true} 
                checked={data?.expandedAcres ?? false}
                onChange={(e) => handleChange(e, 'expandedAcres')}
              />
            } 
            label="Expanded Acres"
          />
          <FormControlLabel 
            control={
              <Checkbox
                disableRipple={true} 
                checked={data?.commingledWells ?? false}
                onChange={(e) => handleChange(e, 'commingledWells')}
              />
            } 
            label="Commingled Wells"
          />
          <FormControlLabel 
            control={
              <Checkbox
                disableRipple={true} 
                checked={data?.changeOfUse ?? false}
                onChange={(e) => handleChange(e, 'changeOfUse')}
              />
            } 
            label="Change of Use"
          />
          <FormControlLabel 
            control={
              <Checkbox
                disableRipple={true} 
                checked={data?.other ?? false}
                onChange={(e) => handleChange(e, 'other')}
              />
            } 
            label="Other"
          />
        </FormGroup>
    </div>
  )
}

export default WellUsageComponent