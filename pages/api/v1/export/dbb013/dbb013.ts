import path from "path"
import { PDFCheckBox, PDFDocument, PDFTextField, rgb, StandardFonts } from "pdf-lib"
import { convertToTableData, getForm } from ".."
import { AgentInfo } from "../../../../../interfaces/AgentInfo"
import { ModifiedBanking, WellUsage } from "../../../../../interfaces/ModifiedBanking"
import { WellPermit } from "../../../../../interfaces/WellPermit"
import faunaClient, { q } from "../../../../../lib/fauna/faunaClient"
import getWellPermitRecord from "../../../../../lib/fauna/ts-queries/getWellPermitRecord"
import fields from "./dbb013-fields"

const addDbb013 = async (
  data: ModifiedBanking[],
  agentInfo: AgentInfo,
  wellUsage: WellUsage,
  debug: boolean = false
) => {
  const pdfBytes = getForm(
    path.resolve('./public'),
    'dbb013.pdf'
  )

  const document = await PDFDocument.load(pdfBytes)
  const form = document.getForm()
  const helvetica = await document.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await document.embedFont(StandardFonts.HelveticaBold)
  const fontSize = 11
  const page = document.getPage(0)

  const permitNumber = data[0].permitNumber
  const {
    q40,
    q160,
    section,
    township,
    range,
    contactName
  }: WellPermit = await faunaClient.query(getWellPermitRecord(permitNumber ?? ''))


  const tableData = {
    ...data && data.length ? convertToTableData(data)[0] : {},
    ...agentInfo,
    permitNumber: permitNumber,
    location: `${q40} 1/4 ${q160} 1/4 Sec ${section}, T ${township}, R ${range}`,
    owner: contactName,
    name: agentInfo.firstName + ' ' + agentInfo.lastName,
    district: agentInfo.agentFor,
    signature: `Digitally Signed by cowaterexport.com; User ID: ${agentInfo.user_id}`,
    signatureDay: new Date().toLocaleDateString('en-us', { day: 'numeric' }),
    signatureMonth: new Date().toLocaleDateString('en-us', { month: 'long' }),
    signatureYear: new Date().toLocaleDateString('en-us', { year: 'numeric' }),
  }

  fields(debug).forEach(field => page.drawRectangle(field.box))

  const formFields = fields(false).map(field => {
    if (field.type === 'checkBox') return form.createCheckBox(field.name)
    return form.createTextField(field.name)
  })

  formFields.forEach((formField, i) => {
    const { name, box } = fields()[i]
    if (name === 'filler') return
    if (formField instanceof PDFTextField) {
      const fieldValue = tableData[name] ? tableData[name].toString() : undefined
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

  const wellUsageKeys = Object.keys(wellUsage) as (keyof typeof wellUsage)[]
  wellUsageKeys.forEach(key => {
    const formField = formFields.find(el => el.getName() === key && el instanceof PDFCheckBox)
    if (!formField || !(formField instanceof PDFCheckBox)) return
    wellUsage[key] === true && formField.check()
  })

  return document
}

export default addDbb013
