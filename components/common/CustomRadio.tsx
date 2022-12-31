import { Radio, RadioProps } from "@mui/material"
import { useState } from "react"


interface Props {

}

const CustomRadio = (props: RadioProps) => {
  return (
    <Radio 
      icon={<RbIcon />}
      checkedIcon={<RbCheckedIcon />}
      disableRipple={true}
      {...props}
    />
  )
}

const RbIcon = () => {
  return (
    <span
      className={`
        h-[20px]
        w-[20px] 
        rounded-full
        border border-gray-300
      `}
    >
    </span>
  )
}

interface RbCheckedIconProps {
  hover?: boolean
}

const RbCheckedIcon = ({ hover }: RbCheckedIconProps) => {
  return (
    <span
      className={`
        h-[20px]
        w-[20px] 
        rounded-full
        border border-gray-300
        flex items-center justify-center
      `}
    >
      <span 
        className={`
          h-[13px]
          w-[13px]
          rounded-full
          tranisition ease-in-out
          ${hover ? 'bg-sky-600' : 'bg-primary-500'}
        `}
      />
    </span>
  )
}

export default CustomRadio