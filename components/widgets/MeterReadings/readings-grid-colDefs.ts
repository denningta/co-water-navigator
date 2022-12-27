import { ColDef, ICellRendererParams, IHeaderParams, ValueSetterParams } from "ag-grid-community";
import CalcValueCellRenderer from "./CalcValueCellRenderer";
import CalcValueHeaderRenderer from "./CalcValueHeaderRenderer";
import { calculatedValueGetter, calculatedValueSetter, dateFormatter, getCellClassRules } from "./helpers";

export const readingsGridDefaultColDef = {
  resizable: true,
  editable: true,
  sortable: false,
  filter: false,
  autoHeaderHeight: true,
  wrapHeaderText: true,
  minWidth: 120,
}

export const createCalculatedValueColDef = (field: string, validatorFn: (params: ValueSetterParams) => boolean): ColDef => {
  return {
    field: field,
    valueGetter: (params) => calculatedValueGetter(params, field),
    valueSetter: (params) => calculatedValueSetter(params, field, validatorFn),
    cellClassRules: getCellClassRules(field),
    cellRenderer: (params: ICellRendererParams) => CalcValueCellRenderer(params, field),
    headerComponent: CalcValueHeaderRenderer,
  }
}

// export const readingsGridColDefs: ColDef[] = [
//   { 
//     field: 'date',
//     minWidth: 150,
//     editable: false,
//     sort: 'asc',
//     valueFormatter: dateFormatter,
//     cellClassRules: getCellClassRules('date'),
//   },
//   { 
//     field: 'flowMeter',
//     minWidth: 120,
//     valueGetter: (params) => calculatedValueGetter(params, 'flowMeter'),
//     valueSetter: (params) => calculatedValueSetter(params, 'flowMeter'),
//     cellClassRules: getCellClassRules('flowMeter'),
//     cellRenderer: (params: ICellRendererParams) => CalcValueCellRenderer(params, 'flowMeter'),
//     headerComponent: CalcValueHeaderRenderer,
//   },
//   { 
//     field: 'powerMeter',
//     valueGetter: (params) => calculatedValueGetter(params, 'powerMeter'),
//     valueSetter: (params) => calculatedValueSetter(params, 'powerMeter'),
//     cellClassRules: getCellClassRules('powerMeter'),
//     cellRenderer: (params: ICellRendererParams) => CalcValueCellRenderer(params, 'powerMeter'),
//     headerComponent: CalcValueHeaderRenderer
//   },
//   { 
//     field: 'powerConsumptionCoef',
//     headerName: 'Power Consumption Coefficient',
//     valueGetter: (params) => calculatedValueGetter(params, 'powerConsumptionCoef'),
//     valueSetter: (params) => calculatedValueSetter(params, 'powerConsumptionCoef'),
//     cellClassRules: getCellClassRules('powerConsumptionCoef'),
//     cellRenderer: (params: ICellRendererParams) => CalcValueCellRenderer(params, 'powerConsumptionCoef'),
//     headerComponent: CalcValueHeaderRenderer
//   },
//   { 
//     field: 'pumpedThisPeriod',
//     valueGetter: (params) => calculatedValueGetter(params, 'pumpedThisPeriod'),
//     valueSetter: (params) => calculatedValueSetter(params, 'pumpedThisPeriod'),
//     cellClassRules: getCellClassRules('pumpedThisPeriod'),
//     cellRenderer: (params: ICellRendererParams) => CalcValueCellRenderer(params, 'pumpedThisPeriod'),
//     headerComponent: CalcValueHeaderRenderer
//   },
//   { 
//     field: 'pumpedYearToDate',
//     valueGetter: (params) => calculatedValueGetter(params, 'pumpedYearToDate'),
//     valueSetter: (params) => calculatedValueSetter(params, 'pumpedYearToDate'),
//     cellClassRules: getCellClassRules('pumpedYearToDate'),
//     cellRenderer: (params: ICellRendererParams) => CalcValueCellRenderer(params, 'pumpedYearToDate'),
//     headerComponent: CalcValueHeaderRenderer
//   },
//   {
//     field: 'availableThisYear',
//     valueGetter: (params) => calculatedValueGetter(params, 'availableThisYear'),
//     valueSetter: (params) => calculatedValueSetter(params, 'availableThisYear'),
//     cellClassRules: getCellClassRules('availableThisYear'),
//     cellRenderer: (params: ICellRendererParams) => CalcValueCellRenderer(params, 'availableThisYear'),
//     headerComponent: CalcValueHeaderRenderer
//   },
//   { field: 'readBy' },
//   { field: 'comments' },
//   { 
//     field: 'updatedBy',
//     editable: false,
//     cellClassRules: getCellClassRules('updatedBy')
//   },
// ]