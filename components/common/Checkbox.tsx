import { useEffect, useState } from "react"
import { FaCheck } from "react-icons/fa"

interface Props {
  title?: string | JSX.Element | undefined
  checked?: boolean
  value: string | undefined
  onChange?: ([value, checked]: [string, boolean]) => void
}

const Checkbox = ({ 
  title,
  checked = false,
  value = 'undefined',
  onChange
}: Props) => {
  const [hover , setHover] = useState(false)
  const [checkboxTitle, setCheckboxTitle] = useState(title)
  const [check, setCheck] = useState(checked)

  useEffect(() => {
    setCheckboxTitle(title ?? value)
  }, [title, value])

  const handleMouseEnter = () => {
    setHover(true)
  }

  const handleMouseLeave = () => {
    setHover(false)
  }

  const handleClick = () => {
    setCheck(!check)
    onChange && onChange([value, !check])
  }

  return (
    <div
      onClick={handleClick} 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="flex items-center cursor-pointer select-none w-fit">
      <div 
        className={`w-[20px] h-[20px] border border-gray-300 rounded overflow-clip transition ease-in-out ${hover && 'bg-gray-100'}`
        }
      >
        { check && <div className={`flex items-center justify-center text-white w-full h-full transition ease-in-out bg-primary p-1 ${hover && 'bg-sky-600'}`}>
          <FaCheck />
        </div> }
      </div>
      <div className="col-span-5 ml-3">{ checkboxTitle }</div>
    </div>
  )
}

const camelCaseToReadableTitle = (inputString: string) => {
  let outputString: string[] = []
  let word = ''
  for (let i = 0; i <= inputString.length; i++) {
    // if (i = 0) { 
    //   word.concat(inputString[i].toUpperCase())
    // } 
    // else {
    //   if (inputString[i] == inputString[i].toUpperCase()) {
    //     outputString.push(word)
    //     word = ''
    //     word.concat(inputString[i].toUpperCase())
    //   } else {
    //     word.concat(inputString[i])
    //   }
    // }
  }
  return outputString.join(' ')
}

export default Checkbox