import { ColDef } from "ag-grid-community";
import DataSummaryCellRenderer from "../CalendarYearSelector/DataSummaryCellRenderer";


export const customColDefs: ColDef[] = [
  { 
    field: 'year',
    maxWidth: 100,
    checkboxSelection: true
  },
  { 
    field: 'dbb004Summary',
    cellRenderer: DataSummaryCellRenderer
  },
  { 
    field: 'dbb013Summary' 
  }
]

export const customDefaultColDefs: ColDef = {
  cellStyle: { cursor: 'pointer' },
  suppressNavigable: true,
  cellClass: 'no-border',
  sortable: true,
  filter: true
}