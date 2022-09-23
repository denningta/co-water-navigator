import { ReactNode } from "react"
import { BsCaretDownFill } from "react-icons/bs"
import Select, { ActionMeta, GroupBase, OptionsOrGroups, StylesConfig } from "react-select"
import { SelectComponents } from "react-select/dist/declarations/src/components"
import Placeholder, { PlaceholderProps } from "react-select/dist/declarations/src/components/Placeholder"
import searchOptions from "../widgets/WellPermitSearch/search-data"



interface Props {
  instanceId?: string
  options?: OptionsOrGroups<unknown, GroupBase<unknown>> | undefined
  isClearable?: boolean
  placeholder?: ReactNode
  required?: boolean
  defaultValue?: any,
  value?: any,
  components?: Partial<SelectComponents<any, boolean, GroupBase<unknown>>> | undefined
  hideCursor?: boolean
  onChange?: (newValue: unknown, actionMeta: ActionMeta<unknown>) => void
}

const TableFilterSelect = ({
  instanceId,
  options,
  isClearable,
  placeholder,
  required = false,
  defaultValue,
  value,
  components,
  hideCursor = false,
  onChange = () => {},
}: Props) => {

  const customStyles: StylesConfig = {
    control: (provided, state) => {
      return {
        ...provided,
        background: 'white',
        border: '1px solid rgb(0, 0, 0, 0.05)',
        boxShadow: 'none',
        filter: 'drop-shadow(2px 2px 2px rgb(0, 0, 0, 0.2))',
        borderRadius: '7px',
        "&:hover": {
          border: '1px solid rgb(0, 0, 0, 0.05)',
          boxShadow: 'none',
        },
        cursor: 'pointer'
      }
    },
    placeholder: (provided) => {
      return {
        ...provided,
        color: 'rgb(0, 0, 0, 0.6)',
      }
    },
    indicatorSeparator: (provided, state) => {
      return {
        ...provided,
        width: '0'
      }
    },
    input: (provided) => {
      return hideCursor 
        ? { ...provided, color: 'transparent' } 
        : { ...provided }
    },
    option: (provided) => {
      return {
        ...provided,
        cursor: 'pointer'
      }
    }
  }

  const handleChange = (newValue: unknown, actionMeta: ActionMeta<unknown>) => {
    onChange(newValue, actionMeta)
  }

  return (
    <div className="mb-4">
      <Select
        instanceId={instanceId}
        options={options}
        isClearable={isClearable}
        placeholder={
          <div>
            { placeholder } 
            { required && <span className="ml-1 text-rose-400">*</span> }
          </div>
        }
        styles={customStyles}
        components={{
          ...components,
          DropdownIndicator: CustomIndicator,
        }}
        onChange={handleChange}
        defaultValue={defaultValue}
        value={value}
        classNamePrefix="select"
      />

    </div>
  )
}


const CustomIndicator = ({ innerProps }: any) => (  
  <div {...innerProps} className="mr-3 opacity-60">
    <BsCaretDownFill />
  </div>
)


export default TableFilterSelect