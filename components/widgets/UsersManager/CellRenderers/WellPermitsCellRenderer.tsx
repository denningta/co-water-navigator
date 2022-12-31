import { ICellRendererParams } from "ag-grid-community"
import { useEffect, useState } from "react"
import { WellPermitAssignment } from "../../../../interfaces/WellPermit"
import { Tooltip } from '@mui/material'
import { mutate } from 'swr'
import useWellPermitsByUser from "../../../../hooks/useWellPermitsByUser"
import { AiOutlineConsoleSql } from "react-icons/ai"

const WellPermitsCellRenderer = (params: ICellRendererParams) => {
  const permitRefs = params.data && params.data.app_metadata && params.data.app_metadata.permitRefs
  const [requested, setRequested] = useState<WellPermitAssignment[]>()
  const [approved, setApproved] = useState<WellPermitAssignment[]>()
  const [rejected, setRejected] = useState<WellPermitAssignment[]>()
  const { data } = useWellPermitsByUser(params.data.user_id)

  useEffect(() => {
    if (!data) return
    setApproved(data.filter(permit => permit.status === 'approved'))
    setRequested(data.filter(permit => permit.status === 'requested'))
    setRejected(data.filter(permit => permit.status === 'rejected'))
  }, [data])

  const getPermitNumbers = (permits: WellPermitAssignment[], length = 5) => {
    const permitNumbers = permits.map(permit => permit.permit ?? '').slice(0, length).join(' ')
    if (permits.length > length) permitNumbers.concat(' ...')
    return permitNumbers
  }

  return (
    <span>
      {data && <>
        {requested && requested.length > 0 &&
          <Tooltip title={getPermitNumbers(requested)} arrow={true}>
            <span className="px-3 py-1 bg-violet-200 text-violet-700 rounded font-semibold">
              {requested.length} requested
            </span>
          </Tooltip>
        }
        {approved && approved.length > 0 &&
        <Tooltip title={getPermitNumbers(approved)} arrow={true}>
          <span className="ml-2 px-3 py-1 bg-success-200 text-success-700 rounded font-semibold">
            {approved.length} approved
          </span>
        </Tooltip>
        }
        {rejected && rejected.length > 0 &&
          <Tooltip title={getPermitNumbers(rejected)} arrow={true}>
            <span className="ml-2 px-3 py-1 bg-error-200 text-error-700 rounded font-semibold">
              {rejected.length} rejected
            </span>
          </Tooltip>
        }
      </>}
      {!data && 
        <span className=" px-16 rounded-full bg-gradient-to-r from-primary-500 via-white to-primary-500 bg-opacity-10 background-animate text-white">
          loading . . .
        </span>
      }
    </span>
  )
}

export default WellPermitsCellRenderer