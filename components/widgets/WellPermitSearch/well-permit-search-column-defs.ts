import { ColDef } from "ag-grid-community"

const wellPermitColumnDefs: ColDef[] = [
  {
    field: 'permit',
    hide: false,
    checkboxSelection: true,
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true
  },
  {
    field: 'receipt',
    hide: false
  },
  {
    field: 'contactName',
    hide: false
  },
  {
    field: 'permitCurrentStatusDescr',
    hide: false
  },
  {
    field: 'division',
    hide: true
  },
  {
    field: 'county',
    hide: true
  },
  {
    field: 'managementDistrictName',
    hide: true
  },
  {
    field: 'designatedBasinName',
    hide: true
  },
  {
    field: 'waterDistrict',
    hide: true
  },
  {
    field: 'modified',
    hide: true
  },
]

export default wellPermitColumnDefs

