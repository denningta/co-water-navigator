import { getSession } from "@auth0/nextjs-auth0";
import { readdirSync, readFile, readFileSync } from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { AgentInfo } from "../../../../interfaces/AgentInfo";
import MeterReading from "../../../../interfaces/MeterReading";
import { ModifiedBanking } from "../../../../interfaces/ModifiedBanking";
import faunaClient from "../../../../lib/fauna/faunaClient";
import getAgentInfo from "../../../../lib/fauna/ts-queries/getAgentInfo";
import addDbb004 from "./dbb004/dbb004";
import addDbb013 from "./dbb013/dbb013";

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
  agentInfo: AgentInfo
}

const exportHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = getSession(req, res)
  const user_id = session?.user?.sub

  const agentInfo =  await faunaClient.query(getAgentInfo(user_id))

  const pdfBytes = await createPdf({
    ...req.body,
    agentInfo: agentInfo
  })
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


const createPdf = async ({ documents, dataSelection, agentInfo }: ExportData) => {
  const pdfDoc = await PDFDocument.create()

  await Promise.all(
    dataSelection.map(async (el) => {
      if (documents.dbb004) {
        const dbb004 = await addDbb004(el.dbb004Summary, agentInfo)
        await mergeDocuments(pdfDoc, dbb004)
      }
      if (documents.dbb013) {
        const dbb013 = await addDbb013(el.dbb013Summary, agentInfo)
        await mergeDocuments(pdfDoc, dbb013)
      }
    })
  )

  const pdfBytes = await pdfDoc.save()
  return pdfBytes
}

export const convertToTableData = (data: any[]) => {
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







export default exportHandler