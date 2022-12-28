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
