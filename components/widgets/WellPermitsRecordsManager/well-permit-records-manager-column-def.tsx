import { ColDef, ICellRendererParams } from "ag-grid-community"

export const defaultColDef: ColDef = {
  filter: true
}

const colDefs: ColDef[] = [
  {
    field: 'permit',
    hide: false,
    checkboxSelection: true,
    sortable: true,
    filter: true,
    maxWidth: 160
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

export default colDefs
