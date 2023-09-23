import { ColDef, ICellRendererParams } from "ag-grid-community"

export const defaultColDef: ColDef = {
  filter: true
}

const wellPermitColumnDefs: ColDef[] = [
  {
    field: 'permit',
    hide: false,
    checkboxSelection: true,
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    sortable: true,
    filter: true
  },
  {
    field: 'receipt',
    hide: true,
    sortable: true
  },
  {
    field: 'contactName',
    hide: false
  },
  {
    field: 'location',
    hide: false,
    cellRenderer: (params: ICellRendererParams) => {
      const { q40, q160, section, township, range } = params.data

      return (
        <div>
          {q40} 1/4 {q160} 1/4 Sec {section}, T {township}, R {range}
        </div>
      )

    }
  },
  {
    field: 'permitCurrentStatusDescr',
    hide: true
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

