import { ColDef } from "ag-grid-community";
import DataSummaryCellRenderer from "../CalendarYearSelector/Dbb004HeatmapCellRenderer";


export const exportColDefs: ColDef[] = [
  {
    field: 'permitNumber',
    checkboxSelection: true
  },
  { 
    field: 'year',
    checkboxSelection: false
  },
  { 
    field: 'dbb004Summary',
    cellRenderer: DataSummaryCellRenderer,
    minWidth: 370
  },
  { 
    field: 'dbb013Summary',
    minWidth: 370
  }
]

export const exportDefaultColDefs: ColDef = {
  cellStyle: { cursor: 'pointer' },
  suppressNavigable: true,
  cellClass: 'no-border',
  sortable: true,
  filter: true,
  resizable: true
}