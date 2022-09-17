import { Tooltip } from "@mui/material";
import { ICellRendererParams } from "ag-grid-community";
import { Role } from "auth0";

const RolesCellRenderer = (params: ICellRendererParams) => {
  return (
    <span>
      {params.value.map((role: Role, i: number) => {
        let color = 'bg-emerald-200 text-emerald-800'
        if (role.name === 'admin') color = 'bg-rose-200 text-rose-800'

        return (
          <Tooltip key={i} title={role.description ?? ''}>
            <span  className={`mr-2 px-3 py-1 rounded font-semibold ${color}`}>
              {role.name && role.name.charAt(0).toUpperCase() + role.name.slice(1)}
            </span>
          </Tooltip>
        )
      })}
    </span>
  )
}

export default RolesCellRenderer