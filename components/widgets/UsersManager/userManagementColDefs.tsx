import { ColDef, ICellRendererParams, ValueFormatterParams } from "ag-grid-community";
import ActionsCellRenderer from "./CellRenderers/ActionsCellRenderer";
import NameCellRenderer from "./CellRenderers/NameCellRenderer";
import RolesCellRenderer from "./CellRenderers/RolesCellRenderer";
import WellPermitsCellRenderer from "./CellRenderers/WellPermitsCellRenderer";

export const userManagementDefaultColDefs: ColDef = {
  resizable: true
} 

const userManagementColDefs: ColDef[] = [
  {
    field: '',
    pinned: 'right',
    minWidth: 60,
    cellRenderer: ActionsCellRenderer,
    cellStyle: { textAlign: 'center' },
    filter: false
  },
  {
    field: 'name',
    hide: false,
    minWidth: 150,
    cellRenderer: NameCellRenderer
  },
  { 
    field: 'email',
    minWidth: 150,
    hide: false
  },
  { 
    field: 'last_login',
    hide: false,
    minWidth: 150,
    headerName: 'Last Login',
    valueFormatter: (params: ValueFormatterParams) => 
      params.value ? new Date(params.value).toDateString() : ''
  },
  {
    field: 'wellPermits',
    minWidth: 250,
    cellRenderer: WellPermitsCellRenderer
  },
  {
    field: 'roles',
    minWidth: 150,
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