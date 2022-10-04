import { FormMetaData } from "./generatre-form-elements"

const CustomFormComponent = ({lineNumber, title, description}: FormMetaData) => {
  return (
    <div className="flex items-center min-h-[100px]">
      <div className="h-full w-full max-w-[100px] font-bold text-2xl text-center">
        {lineNumber}
      </div>
      <div className="">
        <div className="font-bold">{title}</div>
        <div className="">{description}</div>
      </div>
    </div>
  )
}

export default CustomFormComponent