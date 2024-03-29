import { QueryValueObject } from "fauna"
import _ from "lodash"
import path from "path"
import { PDFCheckBox, PDFDocument, PDFTextField, rgb, StandardFonts } from "pdf-lib"
import { convertToTableData, getForm } from ".."
import { AgentInfo } from "../../../../../interfaces/AgentInfo"
import MeterReading, { CalculatedValue } from "../../../../../interfaces/MeterReading"
import { ModifiedBankingSummary, ModifiedBankingSummaryRow, WellUsage } from "../../../../../interfaces/ModifiedBanking"
import fauna from "../../../../../lib/fauna/faunaClientV10"
import getWellPermitSelectedRecord from "../../../../../lib/fauna/ts-queries/well-permits/getWellPermitSelectedRecord"
import { drawTable } from "../../../../../lib/pdf-lib/helpers"
import colDefs from "./col-defs"
import fields from "./dbb004-fields"

const addDbb004 = async (
  data: MeterReading[],
  bankingSummary: ModifiedBankingSummary,
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

  const response = await fauna.query(getWellPermitSelectedRecord(permitNumber))

  const {
    q40,
    q160,
    section,
    township,
    range,
    contactName
  } = response.data as QueryValueObject

  const formData: any = {
    ...agentInfo,
    ...convertBankingSummaryToObject(bankingSummary.bankingData),
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
        borderColor: rgb(0, 0, 0)
      })
    }
  })

  if (wellUsage) {
    const wellUsageKeys = Object.keys(wellUsage) as (keyof typeof wellUsage)[]
    wellUsageKeys.forEach(key => {
      const formField = formFields.find(el => el.getName() === key && el instanceof PDFCheckBox)
      if (!formField || !(formField instanceof PDFCheckBox)) return
      wellUsage[key] === true && formField.check()
    })
  }

  const tableData = data && convertToTableData(data)

  const tableBox = () => {
    return {
      x: 36.5,
      y: 116,
      width: 715.4,
      height: 266.5,
      borderColor: rgb(0, 1, 0)
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

interface BankingSummaryObj {
  allowedAppropriation?: number | undefined
  pumpingLimitThisYear?: number | undefined
  flowMeterLimit?: number | undefined
}

const convertBankingSummaryToObject = (bankingData: ModifiedBankingSummaryRow[]): BankingSummaryObj => {
  const result: BankingSummaryObj = {}

  bankingData.forEach((item) => {
    const value = item.value?.value
    if (typeof value === 'number') {
      result[item.name] = item.value?.value as number
    }
  })

  return result
}




export default addDbb004
