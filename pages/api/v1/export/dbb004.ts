import _ from "lodash"
import path from "path"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import { getForm } from "."
import MeterReading from "../../../../interfaces/MeterReading"
import { drawTable, PDFColDef } from "../../../../lib/pdf-lib/helpers"
import { BoundingBox } from "../../../../lib/pdf-lib/interfaces"

const addDbb004 = async (data?: MeterReading[], debug: boolean = false) => {
  const pdfBytes = getForm(
    path.resolve('./public'),
    'dbb004.pdf'
  )

  const document = await PDFDocument.load(pdfBytes)
  const helvetica = await document.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await document.embedFont(StandardFonts.HelveticaBold)
  const page = document.getPage(0)
  document.removePage(1)

  // const cell = ({ width, height, x, y}: BoundingBox): BoundingBox => {
  //   return {
  //     width: width,
  //     height: height,
  //     x: x,
  //     y: y,
  //     borderColor: rgb(1,0,0),
  //   }
  // }

  // const row = (position: {x: number, y: number}): BoundingBox[] => {
  //   const rowHeight = 20.5
  //   const colWidths = [44.5, 64.2, 64.3, 64.3, 59.7, 59.7, 59.7, 29.5, 269.5]
  //   console.log(_.sum(colWidths))
  //   return colWidths.map((col, i) => {
  //     return cell({ 
  //       width: col, 
  //       height: rowHeight, 
  //       x: i === 0 ? position.x : position.x + _.sum(colWidths.slice(0,i)),
  //       y: position.y
  //     })
  //   })
  // }

  // const table = () => {
  //   const numberOfRows = 13
  //   const startingPoint = { x: 36.5, y: 362 }
  //   const rows = []
  //   const rowHeight = 20.5
  //   for (let i = 0; i <= (numberOfRows - 1); i++) {
  //     rows.push(row({
  //       x: startingPoint.x,
  //       y: i === 0 ? startingPoint.y : startingPoint.y - (i * rowHeight)
  //     }))
  //   }
  //   return rows
  // }

  // debug && table().forEach(row => row.forEach(cell => page.drawRectangle(cell)))



  const tableData = data && convertToTableData(data)
  const colDefs: PDFColDef[] = [
    { 
      field: 'date', 
      title: 'Date M/D/Y',
      width: 44.5,
      font: helvetica
    },
    { 
      field: 'flowMeter', 
      title: 'Flow Meter Reading (ac-ft)',
      width: 64.2,
      font: helvetica
    },
    { 
      field: 'powerMeter', 
      title: 'Power Meter Reading',
      width: 64.3,
      font: helvetica
    },
    { 
      field: 'powerConsumptionCoef', 
      title: 'Power Consumption Coef.',
      width: 64.3,
      font: helvetica
    },
    { 
      field: 'pumpedThisPeriod', 
      title: 'Acre-Feet Pumped This Period',
      width: 59.7,
      font: helvetica
    },
    { 
      field: 'pumpedYearToDate', 
      title: 'Acre-Feet Pumped This Year-To-Date',
      width: 59.7,
      font: helvetica
    },
    { 
      field: 'availableThisYear', 
      title: 'Acre-Feet Available This Year',
      width: 59.7,
      font: helvetica
    },
    { 
      field: 'readyBy', 
      title: 'Read By (init)',
      width: 29.5,
      font: helvetica
    },
    { 
      field: 'comments', 
      title: 'COMMENTS / NOTES',
      width: 269.5,
      font: helvetica
    },
  ]

  const tableBox = () => {
    return {
      x: 36.5,
      y: 116,
      width: 715.4,
      height: 266.5,
      borderColor: rgb(0,1,0)
    }
  }

  debug && page.drawRectangle(tableBox())

  drawTable(page, tableBox(), {
    colDefs,
    data: tableData,
    showHeaders: false,
    showBorders: false,
    numberOfRows: 13,
    rowHeight: 20.5,
    headerStyles: {
      textOptions: {
        font: helvetica,
        size: 10,
      }
    }
  })
  
  return document

}


const convertToTableData = (data: any[]) => {
  return data.map(el => {
    const keys = Object.keys(el) as (keyof typeof el)[]
    const obj: any = {}
     keys.forEach(key => {
      if (el[key].value !== undefined) obj[key] = el[key].value
      else obj[key] = el[key]
    })
    return obj
  })
}

export default addDbb004