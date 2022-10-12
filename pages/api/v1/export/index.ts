import { readdirSync, readFile, readFileSync } from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { PDFDocument, StandardFonts } from "pdf-lib";
import MeterReading from "../../../../interfaces/MeterReading";
import { ModifiedBanking } from "../../../../interfaces/ModifiedBanking";
import addDbb004 from "./dbb004";
import addDbb013 from "./dbb013";

export interface ExportData {
  fileType: 'pdf' | 'csv'
  documents: {
    dbb004: boolean
    dbb013: boolean
  }
  dataSelection: {
    year: string
    permitNumber: string
    dbb004Summary: MeterReading[]
    dbb013Summary: ModifiedBanking[]
  }[]
}

const exportHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const pdfBytes = await createPdf(req.body)
  const pdfBytesString = `[${pdfBytes.toString()}]`
  res.status(200).json(pdfBytesString)
}

export const getForm = (dir: string, fileName: string) => {
  return new Uint8Array(readFileSync(`${dir}/${fileName}`))
}

const mergeDocuments = async (main: PDFDocument, merge: PDFDocument) => {
  const copiedPages = await main.copyPages(merge, merge.getPageIndices())
  copiedPages.forEach(page => main.addPage(page))
}


const createPdf = async ({ documents, dataSelection }: ExportData) => {
  const pdfDoc = await PDFDocument.create()

  await Promise.all(
    dataSelection.map(async (el) => {
      if (documents.dbb004) {
        const dbb004 = await addDbb004(el.dbb004Summary, true)
        await mergeDocuments(pdfDoc, dbb004)
      }
    
      if (documents.dbb013) {
        const dbb013 = await addDbb013(true)
        await mergeDocuments(pdfDoc, dbb013)
      }
    })
  )

  const pdfBytes = await pdfDoc.save()
  return pdfBytes
}







export default exportHandler