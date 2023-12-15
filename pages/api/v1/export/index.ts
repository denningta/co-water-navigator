import { getSession } from "@auth0/nextjs-auth0";
import { readFileSync } from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { PDFDocument } from "pdf-lib";
import addDbb004 from "./dbb004/dbb004";
import addDbb013 from "./dbb013/dbb013";
import { DataSummary } from "../../../../hooks/useDataSummaryByPermit";
import fauna from "../../../../lib/fauna/faunaClientV10";
import getAgentInfo from "../../../../lib/fauna/ts-queries/agent-info/getAgentInfo";
import { Document } from "fauna";
import { AgentInfo } from "../../../../interfaces/AgentInfo";

export interface ExportData {
  fileType: 'pdf' | 'csv'
  documents: {
    dbb004: boolean
    dbb013: boolean
  }
  dataSelection: DataSummary[]
  user_id: string
}

const exportHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = getSession(req, res)
    const user_id = session?.user?.sub

    const pdfBytes = await createPdf({
      ...req.body,
      user_id
    })
    const pdfBytesString = `[${pdfBytes.toString()}]`
    res.status(200).json(pdfBytesString)

  } catch (error: any) {
    res.status(500).send(error)
    throw new Error(error)
  }
}

export const getForm = (dir: string, fileName: string) => {
  return new Uint8Array(readFileSync(`${dir}/${fileName}`))
}

const mergeDocuments = async (main: PDFDocument, merge: PDFDocument) => {
  const copiedPages = await main.copyPages(merge, merge.getPageIndices())
  copiedPages.forEach(page => main.addPage(page))
}

const createPdf = async ({ documents, dataSelection, user_id }: ExportData) => {
  const pdfDoc = await PDFDocument.create()

  await Promise.all(
    dataSelection.map(async (el) => {
      try {
        let agentInfo: AgentInfo = {
          user_id: user_id,
          permitNumber: '',
          firstName: '',
          lastName: '',
          agentFor: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          zip: ''
        }

        const { data } = await fauna.query<Document & AgentInfo | null>(getAgentInfo(user_id, el.permitNumber))

        if (data) agentInfo = data

        if (documents.dbb004) {
          if (!el.dbb004Summary) return
          const dbb004 = await addDbb004(el.dbb004Summary, el.dbb004BankingSummary, agentInfo, el.wellUsage, el.permitNumber, el.year)
          await mergeDocuments(pdfDoc, dbb004)
        }
        if (documents.dbb013) {
          const dbb013 = await addDbb013(el.dbb013Summary, agentInfo, el.wellUsage, el.permitNumber)
          await mergeDocuments(pdfDoc, dbb013)
        }

      } catch (error: any) {
        throw new Error(error)
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
      if (el[key].value !== undefined) {
        obj[key] = el[key].value === 'user-deleted' ? '' : el[key].value
      } else {
        obj[key] = el[key]
      }
    })
    return obj
  })
}







export default exportHandler
