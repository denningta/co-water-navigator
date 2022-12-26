import { CellValueChangedEvent, FormRendererParams } from "./FormWithCells"
import { FormMetaData } from "./generatre-form-elements"

interface FormProps {
  formMetadata: FormMetaData
  customFormRenderer?: ((params: FormRendererParams) => (JSX.Element | void)) | undefined
  onChange?: (e: CellValueChangedEvent) => void
}

const Form = ({ formMetadata, customFormRenderer, onChange = () => {} }: FormProps) => {

  if (customFormRenderer)
  return (
    <>
      { customFormRenderer({ formMetadata: formMetadata, onChange: onChange }) }
    </>
  )

  return (
    <div className="">
    </div>
  )
}

export default Form