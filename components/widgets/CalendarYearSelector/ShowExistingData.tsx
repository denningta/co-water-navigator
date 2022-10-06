import { FormControlLabel, Switch } from "@mui/material"
import { useEffect } from "react"

interface Props {
  checked: boolean 
  onChange?: (checked: boolean) => void
}

const ShowExistingData = ({ checked, onChange = () => {} }: Props) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    onChange(checked)
  }

  return (
    <div>
      <FormControlLabel 
        control={<Switch onChange={handleChange} checked={checked} />} 
        label="Show years with data only" />
    </div>
  )
}

export default ShowExistingData