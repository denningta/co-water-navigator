import { FormControlLabel, Radio, RadioGroup } from "@mui/material"
import { useState } from "react"


interface Props {
  fileType: string
  onChange?: (fileType: string) => void
}

const FileType = ({ 
  fileType = 'pdf',
  onChange = () => {}
 }: Props) => {

  const handleFileTypeChange = (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    onChange(value)
  }

  return (
    <>
      <div className="text-xl font-bold mb-2">File Type</div>
      <RadioGroup
        onChange={handleFileTypeChange}
        defaultValue="pdf"
        defaultChecked={true}
      >
        <FormControlLabel
          value="pdf" 
          control={<Radio disableRipple={true} disableFocusRipple={true} />} 
          label=".pdf" 
        />
        <FormControlLabel 
          value="json" 
          control={<Radio disableRipple={true} disableFocusRipple={true} />} 
          label=".json" 
        />
      </RadioGroup>
    </>
  )
}

export default FileType