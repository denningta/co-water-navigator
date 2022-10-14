import _ from "lodash"
import path from "path"
import { PDFCheckBox, PDFDocument, PDFTextField, rgb, StandardFonts } from "pdf-lib"
import { convertToTableData, getForm } from ".."
import { AgentInfo } from "../../../../../interfaces/AgentInfo"
import MeterReading from "../../../../../interfaces/MeterReading"
import { WellUsage } from "../../../../../interfaces/ModifiedBanking"
import { WellPermit } from "../../../../../interfaces/WellPermit"
import faunaClient from "../../../../../lib/fauna/faunaClient"
import getWellPermitRecord from "../../../../../lib/fauna/ts-queries/getWellPermitRecord"
import { drawTable } from "../../../../../lib/pdf-lib/helpers"
import colDefs from "./col-defs"
import fields from "./dbb004-fields"

const addDbb004 = async (
  data: MeterReading[], 
  agentInfo: AgentInfo, 
  wellUsage: WellUsage,
  permitNumber: string, 
  year: string, 
  debug: boolean = false
) => {
  const pdfBytes = getForm(
    path.resolve('./public'),
    'dbb004.pdf'
  )

  const document = await PDFDocument.load(pdfBytes)
  const form = document.getForm()
  const helvetica = await document.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await document.embedFont(StandardFonts.HelveticaBold)
  const fontSize = 10
  const page = document.getPage(0)
  document.removePage(1)

  const { 
    q40, 
    q160, 
    section, 
    township, 
    range, 
    contactName 
  }: WellPermit = await faunaClient.query(getWellPermitRecord(permitNumber ?? ''))

  const formData: any = {
    ...agentInfo,
    permitNumber: permitNumber,
    location: `${q40} 1/4 ${q160} 1/4 Sec ${section}, T ${township}, R ${range}`,
    owner: contactName,
    calendarYear: year,
    name: agentInfo.firstName + ' ' + agentInfo.lastName,
    district: agentInfo.agentFor,
    signature: `Digitally Signed by cowaterexport.com; User ID: ${agentInfo.user_id}`,
  }

  fields(debug).forEach(field => page.drawRectangle(field.box))
  
  const formFields = fields(false).map(field => {
    if (field.type === 'checkBox') return form.createCheckBox(field.name)
    return form.createTextField(field.name)
  })

  console.log(wellUsage)

  formFields.forEach((formField, i) => {
    const { name, type, box } = fields()[i]
    if (formField instanceof PDFTextField) {
      const fieldValue = formData[name] ? formData[name].toString() : undefined

      fieldValue && formField.setText(fieldValue)
      formField.addToPage(page, {
        ...box,
        x: box.x + 3,
        width: box.width - 3,
        borderWidth: 0
      })
    }

    if (formField instanceof PDFCheckBox) {
      formField.addToPage(page, {
        ...box,
        borderWidth: 1,
        borderColor: rgb(0,0,0)
      })
    }
  })

  const wellUsageKeys = Object.keys(wellUsage) as (keyof typeof wellUsage)[]
  wellUsageKeys.forEach(key => {
    const formField = formFields.find(el => el.getName() === key && el instanceof PDFCheckBox)
    if (!formField || !(formField instanceof PDFCheckBox)) return
    wellUsage[key] === true && formField.check()
  })

  const tableData = data && convertToTableData(data)

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
    colDefs: colDefs(helvetica),
    data: tableData,
    showHeaders: false,
    showBorders: false,
    numberOfRows: 13,
    rowHeight: 20.5,
    headerStyles: {
      textOptions: {
        font: helvetica,
        size: fontSize,
      }
    }
  })
  
  return document

}




export default addDbb004