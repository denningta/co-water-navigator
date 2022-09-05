import { useState } from "react"

const WellPermitSearch = () => {
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined)


  const handleSearchChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(target.value)
  }

  return (
    <div>
      <input 
        type="text" 
        className="outline-none bg-gray-100 border rounded-lg p-2 transition ease-in-out focus:outline-primary focus:outline-1" 
        onChange={(event) => handleSearchChange(event)}
      />
    </div>
  )
}

export default WellPermitSearch