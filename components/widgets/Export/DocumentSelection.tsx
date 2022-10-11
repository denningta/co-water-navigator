import { Checkbox, FormControlLabel, FormGroup } from "@mui/material"

export type DocumentSelectionObj = {
  dbb004: boolean
  dbb013: boolean
}

interface Props {
  documents: DocumentSelectionObj
  onChange?: (documents: DocumentSelectionObj) => void
}

const DocumentSelection = ({ 
  documents = {
    dbb004: false,
    dbb013: false
  },
  onChange = () => {}
}: Props) => {
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    onChange({
      ...documents,
      [event.target.name]: event.target.checked
    })
  }

  return (
    <>
      <div className="text-xl font-bold mb-2">Documents to Export</div>
      <FormGroup>
        <FormControlLabel
          label="DBB-004: Meter Readings"
          control={<Checkbox
            name="dbb004"
            onChange={handleCheckboxChange}
            disableRipple={true}
            disableFocusRipple={true}
          />}
        />
        <FormControlLabel
          label="DBB-013: 3-Year Modified Banking"
          control={<Checkbox
            name="dbb013"
            onChange={handleCheckboxChange}
            disableRipple={true}
            disableFocusRipple={true}
          />}
        />
      </FormGroup>
    </>
  )
}

export default DocumentSelection