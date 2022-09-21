import { User } from "auth0"
import { UserManagement } from "../../../interfaces/User"
import DataTable from "../DataTable/DataTable"
import userManagementColDefs, { userManagementDefaultColDefs } from "./userManagementColDefs"


interface Props {
  users: UserManagement[]
}

const UserManager = ({ users }: Props) => {
  return (
    <div>
      <DataTable 
        defaultColDef={userManagementDefaultColDefs}
        columnDefs={userManagementColDefs}
        rowData={users}
        suppressRowClickSelection={true}
      />
    </div>
  )
}

export default UserManager