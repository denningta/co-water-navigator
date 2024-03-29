import { Tooltip } from "@mui/material";
import { ICellRendererParams } from "ag-grid-community";
import { Role } from "auth0";
import RoleTag from "../../../common/RoleTag";

const RolesCellRenderer = (params: ICellRendererParams) => {
  return (
    <span>
      {params.value.map((role: Role, i: number) => {
        let color = 'bg-success-200 text-success-800'
        if (role.name === 'admin') color = 'bg-error-200 text-error-800'

        return (
          <Tooltip key={i} title={role.description ?? ''}>
            <span>
              <RoleTag role={role} />
            </span>
          </Tooltip>
        )
      })}
    </span>
  )
}

export default RolesCellRenderer