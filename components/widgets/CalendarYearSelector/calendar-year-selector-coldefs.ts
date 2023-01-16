import { ColDef, ICellRendererParams } from "ag-grid-community";
import DataSummaryCellRenderer from "./Dbb004HeatmapCellRenderer";
import Dbb013HeatmapCellRenderer from "./Dbb013HeatmapCellRenderer";

export const yearSelectorColDefs: ColDef[] = [
  { 
    field: 'year',
    maxWidth: 100,
    minWidth: 90
  },
  { 
    field: 'dbb004Summary',
    minWidth: 360,
    cellRenderer: DataSummaryCellRenderer
  },
  { 
    field: 'dbb013Summary',
    minWidth: 310,
    cellRenderer: Dbb013HeatmapCellRenderer
  }
]

export const yearSelectorDefaultColDef: ColDef = {
  cellStyle: { cursor: 'pointer' },
  suppressNavigable: true,
  cellClass: 'no-border',
  sortable: true,
  filter: true
}