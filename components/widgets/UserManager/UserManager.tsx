import { User } from "auth0"
import { UserManagement } from "../../../interfaces/User"
import DataTable from "../DataTable/DataTable"
import userManagementColDefs from "./userManagementColDefs"


interface Props {
  users: UserManagement[]
}

const UserManager = ({ users }: Props) => {
  console.log(users)
  return (
    <div>
      <DataTable 
        columnDefs={userManagementColDefs}
        rowData={users}
      />
    </div>
  )
}

export default UserManager