import { ColDef, ICellRendererParams, ValueFormatterParams } from "ag-grid-community";
import NameCellRenderer from "./NameCellRenderer";
import RolesCellRenderer from "./RolesCellRenderer";

const userManagementColDefs: ColDef[] = [
  {
    field: 'name',
    hide: false,
    cellRenderer: NameCellRenderer
  },
  { 
    field: 'email',
    hide: false
  },
  { 
    field: 'last_login',
    hide: false,
    headerName: 'Last Login',
    valueFormatter: (params: ValueFormatterParams) => 
      params.value ? new Date(params.value).toDateString() : ''
  },
  {
    field: 'wellPermits'
  },
  {
    field: 'roles',
    cellRenderer: RolesCellRenderer
  },
  { 
    field: 'given_name',
    headerName: 'First Name',
    hide: true
  },
  { 
    field: 'family_name',
    headerName: 'Last Name',
    hide: true
  },
  { 
    field: 'app_metadata',
    hide: true
  },
  { 
    field: 'created_at',
    hide: true
  },
  { 
    field: 'email_verified',
    hide: true
  },
  { 
    field: 'identities',
    hide: true
  },
  { 
    field: 'last_ip',
    hide: true
  },
  { 
    field: 'nickname',
    hide: true,
    headerName: 'Nickname'
  },
  { 
    field: 'picture',
    hide: true
  },
  { 
    field: 'user_id',
    hide: true
  },
  { 
    field: 'user_metadata',
    hide: true
  },
]

export default userManagementColDefs