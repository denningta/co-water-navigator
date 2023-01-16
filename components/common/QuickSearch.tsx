import { IoSearchSharp } from "react-icons/io5"

export interface QuickSearchProps {
  onChange?: (value: string) => void
}

const QuickSearch = ({
  onChange = () => {}
}: QuickSearchProps) => {
  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    onChange(target.value)
  }

  return (
    <div className="flex items-center justify-end relative w-fit">
    <input
      className="border border-gray-400 rounded-full px-3 py-1 pr-10 max-w-lg"
      placeholder="Quick search..."
      onChange={handleChange}
    />
    <div className="absolute right-4">
      <IoSearchSharp />
    </div>
  </div>
  )
}

export default QuickSearch