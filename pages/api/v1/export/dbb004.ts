import { PageSizes, PDFDocument, PDFFont, PDFPageDrawRectangleOptions, rgb } from "pdf-lib"
import { drawTable, getTextObj, PDFColDef } from "../../../../lib/pdf-lib/helpers"
import { TextOptions } from "../../../../lib/pdf-lib/interfaces"

const addDbb004 = async (
  pdfDoc: PDFDocument, 
  fonts: {
    font: PDFFont
    fontBold: PDFFont
  }, 
  debug: boolean = true
) => {
  const landscape: [number, number] = [PageSizes.Letter[1], PageSizes.Letter[0]]
  const { font, fontBold } = fonts
  const fontSize = 10
  const page = pdfDoc.addPage(landscape)

  const defaultTextOptions: TextOptions = {
    size: fontSize,
    font: font
  }

  const { width, height } = page.getSize()
  const [ marginTop, marginLeft, marginRight, marginBottom ] = [ 25, 30, 30, 25 ]

  const marginBox = { 
    width: width - (marginLeft + marginRight), 
    height: height - (marginTop + marginBottom),
    x: marginLeft,
    y: marginBottom,
    borderColor: rgb(1, 0, 0)
  }

  debug && page.drawRectangle(marginBox)

  const addressBox = { 
    width: 270, 
    height: 50,
    x: 300,
    y: height - marginTop - 50,
    borderColor: rgb(1, 0, 0)
  }

  debug && page.drawRectangle(addressBox)

  page.drawText('DBB-004 (11/2011)', {
    ...defaultTextOptions,
    x: marginLeft,
    y: height - (marginTop + fontSize),
  })

  const addressText = [
    getTextObj('COLORADO GROUND WATER COMMISSION', defaultTextOptions, 0, addressBox, 'center'),
    getTextObj('1313 Sherman St., Room 821, Denver, CO 80203', defaultTextOptions, 1, addressBox, 'center'),
    getTextObj('Phone: 303-866-3581, www.water.state.co.us', defaultTextOptions, 2, addressBox, 'center')
  ]

  addressText.forEach(el => page.drawText(el.text, el.options))

  const titleBox = {
    width: width - (marginLeft + marginRight),
    height: 130,
    x: marginLeft,
    y: height - (marginTop + addressBox.height + 130),
    borderColor: rgb(1, 0, 0)
  }

  debug && page.drawRectangle(titleBox)

  const wellDetailsBox = {
    width: 250,
    height: titleBox.height,
    x: titleBox.x,
    y: titleBox.y,
    borderColor: rgb(0, 1, 0)
  }

  debug && page.drawRectangle(wellDetailsBox)

  const wellDetailsText = [
    getTextObj(
      'ADMINISTRATIVE REPORTING - METER READINGS',
      { ...defaultTextOptions, font: fontBold },
      0,
      wellDetailsBox,
      'left'
    ),
    getTextObj('Well Permit No:', defaultTextOptions, 2, wellDetailsBox, 'left'),
    getTextObj('Location:', defaultTextOptions, 4, wellDetailsBox, 'left'),
    getTextObj('Owner:', defaultTextOptions, 6, wellDetailsBox, 'left'),
  ]

  wellDetailsText.forEach(el => page.drawText(el.text, el.options))

  const wellUsageBox = {
    height: titleBox.height,
    width: 150,
    x: wellDetailsBox.x + wellDetailsBox.width,
    y: titleBox.y,
    borderColor: rgb(0, 0, 1)
  }

  debug && page.drawRectangle(wellUsageBox)

  const wellUsageTextOptions: TextOptions = {
    ...defaultTextOptions,
    margin: { left: 20 }
  }

  const wellUsageText = [
    getTextObj('Expanded Acres', wellUsageTextOptions, 2, wellUsageBox),
    getTextObj('Commingled Wells', wellUsageTextOptions, 4, wellUsageBox),
    getTextObj('Change of Use', wellUsageTextOptions, 6, wellUsageBox),
    getTextObj('Other', wellUsageTextOptions, 8, wellUsageBox),
  ]

  let checkbox: PDFPageDrawRectangleOptions = {
    height: 12,
    width: 12,
    borderColor: rgb(0, 0, 0),
  }

  wellUsageText.forEach(el => {
    page.drawText(el.text, el.options)
    checkbox = { ...checkbox, x: wellUsageBox.x, y: el.options.y - 3 }
    page.drawRectangle(checkbox)
  })

  const bankingDataBox = {
    height: titleBox.height,
    width: titleBox.width - (wellDetailsBox.width + wellUsageBox.width),
    x: wellUsageBox.x + wellUsageBox.width,
    y: titleBox.y,
    borderColor: rgb(1, 1, 0)
  }

  debug && page.drawRectangle(bankingDataBox)

  const bankingDataText = [
    getTextObj('Calendar Year:', defaultTextOptions, 0, bankingDataBox),
    getTextObj('Allowed Annual Appropriation Per Approved Change:', defaultTextOptions, 2, bankingDataBox),
    getTextObj('Allowed Pumping This Year With 3-Yr Banking:', defaultTextOptions, 4, bankingDataBox),
    getTextObj('Water/Power Meter Limit* (meter units):', defaultTextOptions, 6, bankingDataBox),
    getTextObj('*Assuming no break on record or meter changes', defaultTextOptions, 7, bankingDataBox),
  ]

  bankingDataText.forEach(el => page.drawText(el.text, el.options))

  const colDefs: PDFColDef[] = [
    { 
      field: 'date', 
      title: 'Date M/D/Y',
      width: 50,
      font: font
    },
    { 
      field: 'flowMeter', 
      title: 'Flow Meter Reading (ac-ft)',
      font: font
    },
    { 
      field: 'powerMeter', 
      title: 'Power Meter Reading',
      font: font
    },
    { 
      field: 'powerConsumptionCoef', 
      title: 'Power Consumption Coef.',
      font: font
    },
    { 
      field: 'pumpedThisPeriod', 
      title: 'Acre-Feet Pumped This Period',
      font: font
    },
    { 
      field: 'pumpedYearToDate', 
      title: 'Acre-Feet Pumped This Year-To-Date',
      font: font
    },
    { 
      field: 'availableThisYear', 
      title: 'Acre-Feet Available This Year',
      font: font
    },
    { 
      field: 'readyBy', 
      title: 'Read By (init)',
      width: 35,
      font: font
    },
    { 
      field: 'comments', 
      title: 'COMMENTS / NOTES',
      width: 230,
      font: font
    },
  ]

  const data = [
    { date: '1990-01', flowMeter: 100, powerMeter: 200.345 },
    { date: '1990-02', flowMeter: 200, powerMeter: 301.345 },
    { date: '1990-03', flowMeter: 300, powerMeter: 450.345 }
  ]

  const headerHeight = 40
  const numberOfRows = 13
  const rowHeight = 20

  const tableBox = {
    width: marginBox.width,
    height: numberOfRows * rowHeight + headerHeight,
    x: marginBox.x,
    y: titleBox.y - (numberOfRows * rowHeight + headerHeight),
    borderColor: rgb(0, 0, 1)
  }

  drawTable(page, tableBox, {
    data: data,
    colDefs: colDefs,
    numberOfRows: numberOfRows,
    rowHeight: rowHeight,
    headerStyles: {
      textOptions: { ...defaultTextOptions, size: 10},
      height: headerHeight
    }
  })

  debug && page.drawRectangle(tableBox)

  const signatureBox = {
    width: marginBox.width / 2,
    height: marginBox.height - (titleBox.height + tableBox.height + addressBox.height),
    x: marginBox.x,
    y: marginBox.y,
    borderColor: rgb(0,1,0)
  }

  debug && page.drawRectangle(signatureBox)

  const signatureText = [
    getTextObj('ADMINISTRATIVE ENTITY/AGENT:', defaultTextOptions, 1, signatureBox),
    getTextObj('Name (please print):', defaultTextOptions, 3, signatureBox),
    getTextObj('Signature:', defaultTextOptions, 5, signatureBox)
  ]

  signatureText.forEach(el => page.drawText(el.text, el.options))

  const agentAddressBox = {
    width: marginBox.width / 2,
    height: marginBox.height - (titleBox.height + tableBox.height + addressBox.height),
    x: signatureBox.x + signatureBox.width,
    y: marginBox.y,
    borderColor: rgb(1,0,0)
  }

  debug && page.drawRectangle(agentAddressBox)

  const userAddressText = [
    getTextObj('Address:', defaultTextOptions, 1, agentAddressBox),
    getTextObj('City:', defaultTextOptions, 3, agentAddressBox),
    getTextObj('State:', {...defaultTextOptions, margin: { left: 150 }}, 3, agentAddressBox),
    getTextObj('Zip:', {...defaultTextOptions, margin: { left: 230 }}, 3, agentAddressBox),
    getTextObj('Phone:', defaultTextOptions, 5, agentAddressBox),
  ]

  userAddressText.forEach(el => page.drawText(el.text, el.options))

}

export default addDbb004