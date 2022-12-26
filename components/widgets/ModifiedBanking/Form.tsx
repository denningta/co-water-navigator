import { FormRendererParams } from "./FormWithCells"
import { FormMetaData } from "./generatre-form-elements"

interface FormProps {
  formMetadata: FormMetaData
  customFormRenderer?: ((params: FormRendererParams) => (JSX.Element | void)) | undefined
}

const Form = ({ formMetadata, customFormRenderer }: FormProps) => {

  if (customFormRenderer)
  return (
    <>
      { customFormRenderer({ formMetadata: formMetadata }) }
    </>
  )

  return (
    <div className="">
    </div>
  )
}

export default Form