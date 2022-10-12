import path from "path"
import { PDFCheckBox, PDFDocument, PDFTextField, rgb, StandardFonts } from "pdf-lib"
import { convertToTableData, getForm } from ".."
import { ModifiedBanking } from "../../../../../interfaces/ModifiedBanking"
import fields from "./dbb013-fields"

const addDbb013 = async (data: ModifiedBanking[], debug: boolean = false,) => {
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

  const tableData = data && data.length ? convertToTableData(data)[0] : {}

  tableData.signatureDay = new Date().toLocaleDateString('en-us', { day: 'numeric' })
  tableData.signatureMonth = new Date().toLocaleDateString('en-us', { month: 'long' })
  tableData.signatureYear = new Date().toLocaleDateString('en-us', { year: 'numeric' })

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