import { ColDef } from "ag-grid-community";
import DataSummaryCellRenderer from "./DataSummaryCellRenderer";

export const yearSelectorColDefs: ColDef[] = [
  { 
    field: 'year',
    maxWidth: 100
  },
  { 
    field: 'dbb004Summary',
    cellRenderer: DataSummaryCellRenderer
  },
  { 
    field: 'dbb013Summary' 
  }
]

export const yearSelectorDefaultColDef: ColDef = {
  cellStyle: { cursor: 'pointer' },
  suppressNavigable: true,
  cellClass: 'no-border',
  sortable: true,
  filter: true
}