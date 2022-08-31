import { useState } from "react"
import { FaCheck } from "react-icons/fa"

interface Props {
  title: string
}

const Checkbox = ({ title }: Props) => {
  const [checked, setChecked] = useState(false)
  const [hover , setHover] = useState(false)

  const handleMouseEnter = () => {
    setHover(true)
  }

  const handleMouseLeave = () => {
    setHover(false)
  }

  return (
    <div
      onClick={() => setChecked(!checked)} 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="flex items-center cursor-pointer select-none">
      <div 
        className={`w-[20px] h-[20px] border border-gray-300 rounded overflow-clip transition ease-in-out ${hover && 'bg-gray-100'}`
        }
      >
        { checked && <div className={`flex items-center justify-center text-white w-full h-full transition ease-in-out bg-primary p-1 ${hover && 'bg-sky-600'}`}>
          <FaCheck />
        </div> }
      </div>
      <div className="col-span-5 ml-3">{ title }</div>
    </div>
  )
}

export default Checkbox