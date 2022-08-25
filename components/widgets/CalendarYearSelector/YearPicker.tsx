import { useEffect, useState } from "react"
import { AiFillCaretDown } from 'react-icons/ai'

interface YearData {
  year: number,
  disabled: boolean
}

interface Props {
  onSubmit: (year: string) => void 
}

const YearPicker = ({ onSubmit }: Props) => {
  const [valid, setValid] = useState(false)
  const [selectedYear, setSelectedYear] = useState<string>()

  const validateYear = (input: string) => {
    return input.match(/[0-9]{4}/) ? true : false
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (validateYear(event.target.value)) {
      setValid(true)
      setSelectedYear(event.target.value)
    } else {
      setValid(false)
    }
  }

  const handleJumpToYear = () => {
    if (!selectedYear) return
    onSubmit(selectedYear)
  }

  return (
    <div className="col-span-2 flex flex-col items-center justify-center">
    <div className="font-bold text-xl mb-4">Jump to Year</div>
      <div className="flex items-center drop-shadow-md">
        <input
          type="text"
          className="outline-none border h-[40px] rounded-l-full text-center transition ease-in-out"
          onChange={(event) => handleInputChange(event)}
          maxLength={4}
        />
        <button
          className={`bg-primary pl-4 pr-5 h-[40px] rounded-r-full text-white ${!valid && 'bg-gray-400'}`}
          disabled={!valid}
          onClick={handleJumpToYear}>
            Go
        </button>
      </div>
  </div>
  )
}

export default YearPicker