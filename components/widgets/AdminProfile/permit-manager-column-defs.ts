import { ColDef, ICellRendererParams } from "ag-grid-community"
import AccessCellRenderer from "../WellPermitsAssignment/AccessCellRenderer"
import HeatmapCellRenderer from "../WellPermitsAssignment/HeatmapCellRenderer"
import PermitCellRenderer from "../WellPermitsAssignment/PermitCellRenderer"

export const defaultColDef: ColDef = {
  resizable: true
}

const wellPermitColumnDefs: ColDef[] = [
  {
    field: '',
    filter: false,
    maxWidth: 55,
    minWidth: 55,
    pinned: true,
    suppressMovable: true,
    checkboxSelection: true
  },
  {
    field: 'permit',
    hide: false,
    minWidth: 90,
    maxWidth: 150,
    cellRenderer: PermitCellRenderer
  },
  {
    field: 'status',
    headerName: 'Access',
    hide: false,
    minWidth: 150,
    cellRenderer: AccessCellRenderer
  },
  {
    field: 'Meter Reading Summary',
    hide: false,
    minWidth: 410,
    cellRenderer: HeatmapCellRenderer,
  },
  {
    field: 'receipt',
    hide: true
  },
  {
    field: 'contactName',
    minWidth: 150,
    hide: true
  },
  {
    field: 'permitCurrentStatusDescr',
    hide: true
  },
  {
    field: 'asBuiltAquifers',
    hide: true
  },
  {
    field: 'associatedAquifers',
    hide: true
  },
  {
    field: 'associatedCaseNumbers',
    hide: true
  },
  {
    field: 'associatedUses',
    hide: true
  },
  {
    field: 'bottomPerforatedCasing',
    hide: true
  },
  {
    field: 'contactAddress',
    hide: true
  },
  {
    field: 'contactCity',
    hide: true
  },
  {
    field: 'contactPostalCode',
    hide: true
  },
  {
    field: 'contactStateOrProvince',
    hide: true
  },
  {
    field: 'contactType',
    hide: true
  },
  {
    field: 'coordsEw',
    hide: true
  },
  {
    field: 'coordsEwDir',
    hide: true
  },
  {
    field: 'coordsNs',
    hide: true
  },
  {
    field: 'coordsNsDir',
    hide: true
  },
  {
    field: 'county',
    hide: true
  },
  {
    field: 'date1stBeneficialUse',
    hide: true
  },
  {
    field: 'dateApplicationReceived',
    hide: true
  },
  {
    field: 'datePermitExpires',
    hide: true
  },
  {
    field: 'datePermitIssued',
    hide: true
  },
  {
    field: 'datePumpInstalled',
    hide: true
  },
  {
    field: 'dateWellCompleted',
    hide: true
  },
  {
    field: 'dateWellPlugged',
    hide: true
  },
  {
    field: 'denverBasinAquifer',
    hide: true
  },
  {
    field: 'depthTotal',
    hide: true
  },
  {
    field: 'designatedBasinName',
    hide: true
  },
  {
    field: 'division',
    hide: true
  },
  {
    field: 'driller',
    hide: true
  },
  {
    field: 'drillerLic',
    hide: true
  },
  {
    field: 'elevation',
    hide: true
  },
  {
    field: 'latitude',
    hide: true
  },
  {
    field: 'locationAccuracy',
    hide: true
  },
  {
    field: 'locationType',
    hide: true
  },
  {
    field: 'longitude',
    hide: true
  },
  {
    field: 'managementDistrictName',
    hide: true
  },
  {
    field: 'modified',
    hide: true
  },
  {
    field: 'moreInformation',
    hide: true
  },
  {
    field: 'parcelName',
    hide: true
  },
  {
    field: 'permitCategoryDescr',
    hide: true
  },
  {
    field: 'physicalAddress',
    hide: true
  },
  {
    field: 'physicalCity',
    hide: true
  },
  {
    field: 'physicalPostalCode',
    hide: true
  },
  {
    field: 'physicalStateOrProvince',
    hide: true
  },
  {
    field: 'pm',
    hide: true
  },
  {
    field: 'pumpInstaller',
    hide: true
  },
  {
    field: 'pumpLic',
    hide: true
  },
  {
    field: 'pumpTestYield',
    hide: true
  },
  {
    field: 'q10',
    hide: true
  },
  {
    field: 'q160',
    hide: true
  },
  {
    field: 'q40',
    hide: true
  },
  {
    field: 'range',
    hide: true
  },
  {
    field: 'section',
    hide: true
  },
  {
    field: 'staticWaterLevel',
    hide: true
  },
  {
    field: 'staticWaterLevelDate',
    hide: true
  },
  {
    field: 'topPerforatedCasing',
    hide: true
  },
  {
    field: 'township',
    hide: true
  },
  {
    field: 'utmX',
    hide: true
  },
  {
    field: 'utmY',
    hide: true
  },
  {
    field: 'waterDistrict',
    hide: true
  },
  {
    field: 'wdid',
    hide: true
  },
]

export default wellPermitColumnDefs

