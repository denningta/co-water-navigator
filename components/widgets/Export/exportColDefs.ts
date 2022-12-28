import { ColDef } from "ag-grid-community";
import DataSummaryCellRenderer from "../CalendarYearSelector/Dbb004HeatmapCellRenderer";
import Dbb013HeatmapCellRenderer from "../CalendarYearSelector/Dbb013HeatmapCellRenderer";


export const exportColDefs: ColDef[] = [
  {
    field: 'permitNumber',
    checkboxSelection: true,
    maxWidth: 160
  },
  { 
    field: 'year',
    checkboxSelection: false,
    maxWidth: 100
  },
  { 
    field: 'dbb004Summary',
    cellRenderer: DataSummaryCellRenderer,
    minWidth: 400
  },
  { 
    field: 'dbb013Summary',
    minWidth: 400,
    cellRenderer: Dbb013HeatmapCellRenderer
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