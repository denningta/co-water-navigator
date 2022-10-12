import path from "path"
import { PDFCheckBox, PDFDocument, PDFTextField, rgb, StandardFonts } from "pdf-lib"
import { convertToTableData, getForm } from ".."
import { AgentInfo } from "../../../../../interfaces/AgentInfo"
import { ModifiedBanking } from "../../../../../interfaces/ModifiedBanking"
import fields from "./dbb013-fields"

const addDbb013 = async (data: ModifiedBanking[], agentInfo: AgentInfo, debug: boolean = false,) => {
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

  const tableData = {
    ...data && data.length ? convertToTableData(data)[0] : {},
    ...agentInfo,
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
        borderColor: rgb(0,0,0)
      })
    }
  })

  return document
}

export default addDbb013