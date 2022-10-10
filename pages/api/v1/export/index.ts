import { NextApiRequest, NextApiResponse } from "next";
import { PDFDocument, StandardFonts } from "pdf-lib";
import addDbb004 from "./dbb004";
import addDbb013 from "./dbb013";

const exportHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const pdfBytes = await (await createPdf())
  const pdfBytesString = `[${pdfBytes.toString()}]`
  res.status(200).json(pdfBytesString)
}


const createPdf = async () => {
  const pdfDoc = await PDFDocument.create()
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  addDbb013(pdfDoc, { font: helvetica, fontBold: helveticaBold }, true)
  addDbb004(pdfDoc, { font: helvetica, fontBold: helveticaBold }, false)

  const pdfBytes = await pdfDoc.save()
  return pdfBytes
}






export default exportHandler