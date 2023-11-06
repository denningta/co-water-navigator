import { ColDef, ICellRendererParams } from "ag-grid-community";
import DataSummaryCellRenderer from "../CalendarYearSelector/Dbb004HeatmapCellRenderer";
import Dbb013HeatmapCellRenderer from "../CalendarYearSelector/Dbb013HeatmapCellRenderer";
import ActionsCellRenderer from "../WellPermitsAssignment/ActionsCellRenderer";


export const exportColDefs: ColDef[] = [
  {
    field: '',
    filter: false,
    minWidth: 70,
    pinned: 'right',
    suppressMovable: true,
    resizable: false,
    suppressAutoSize: true,
    cellRenderer: (params: ICellRendererParams) => ActionsCellRenderer(params),
    cellStyle: { textAlign: 'center' },
  },
  {
    field: 'permitNumber',
    checkboxSelection: true,
    maxWidth: 160,
    filter: true,
    sortable: true,
    sort: 'asc'
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
