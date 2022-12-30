import { PDFFont } from "pdf-lib";
import { PDFColDef } from "../../../../../lib/pdf-lib/helpers";

const colDefs = (font: PDFFont): PDFColDef[] => [
  { 
    field: 'date', 
    title: 'Date M/D/Y',
    width: 44.5,
    font: font
  },
  { 
    field: 'flowMeter', 
    title: 'Flow Meter Reading (ac-ft)',
    width: 64.2,
    font: font
  },
  { 
    field: 'powerMeter', 
    title: 'Power Meter Reading',
    width: 64.3,
    font: font
  },
  { 
    field: 'powerConsumptionCoef', 
    title: 'Power Consumption Coef.',
    width: 64.3,
    font: font
  },
  { 
    field: 'pumpedThisPeriod', 
    title: 'Acre-Feet Pumped This Period',
    width: 59.7,
    font: font
  },
  { 
    field: 'pumpedYearToDate', 
    title: 'Acre-Feet Pumped This Year-To-Date',
    width: 59.7,
    font: font
  },
  { 
    field: 'availableThisYear', 
    title: 'Acre-Feet Available This Year',
    width: 59.7,
    font: font
  },
  { 
    field: 'readBy', 
    title: 'Read By (init)',
    width: 29.5,
    font: font
  },
  { 
    field: 'comments', 
    title: 'COMMENTS / NOTES',
    width: 269.5,
    font: font
  },
]

export default colDefs