import { User } from "auth0"
import { UserManagement } from "../../../interfaces/User"
import DataTable from "../DataTable/DataTable"
import userManagementColDefs, { userManagementDefaultColDefs } from "./userManagementColDefs"
import { IoSearchSharp } from 'react-icons/io5'
import React, { useState } from "react"


interface Props {
  users: UserManagement[]
}

const UserManager = ({ users }: Props) => {
  const [quickFilter, setQuickFilter] = useState<string | undefined>(undefined)

  const handleQuickFilter = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    if (target.value === '') setQuickFilter(undefined)
    setQuickFilter(target.value)
  }

  return (
    <div>
      <div className="flex items-center justify-end mb-4 relative w-fit">
        <input
          className="border border-gray-400 rounded-full px-3 py-1 pr-10 max-w-lg"
          placeholder="Quick search..."
          onChange={handleQuickFilter}
        />
        <div className="absolute right-4">
          <IoSearchSharp />
        </div>
      </div>
      <DataTable 
        defaultColDef={userManagementDefaultColDefs}
        columnDefs={userManagementColDefs}
        rowData={users}
        suppressRowClickSelection={true}
        quickFilter={quickFilter}
      />
    </div>
  )
}

export default UserManager