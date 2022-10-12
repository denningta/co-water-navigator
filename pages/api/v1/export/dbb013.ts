import path from "path"
import { PDFDocument } from "pdf-lib"
import { getForm } from "."
import { ModifiedBanking } from "../../../../interfaces/ModifiedBanking"

const addDbb013 = async (debug: boolean = false, data?: ModifiedBanking) => {

  const pdfBytes = getForm(
    path.resolve('./public'),
    'dbb013.pdf'
  )

  const document = await PDFDocument.load(pdfBytes)

  
  return document
}

export default addDbb013