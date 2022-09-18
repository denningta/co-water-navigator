import { ICellRendererParams } from "ag-grid-community"
import { useEffect, useState } from "react"
import usePermitAssignments from "../../../hooks/usePermitAssignments"
import { WellPermitAssignment } from "../../../interfaces/WellPermit"
import { Tooltip } from '@mui/material'

const WellPermitsCellRenderer = (params: ICellRendererParams) => {
  const permitRefs = params.data && params.data.app_metadata && params.data.app_metadata.permitRefs
  const permitAssignments = usePermitAssignments(permitRefs)
  const [requested, setRequested] = useState<WellPermitAssignment[]>()
  const [approved, setApproved] = useState<WellPermitAssignment[]>()

  useEffect(() => {
    if (!permitAssignments) return
    setApproved(permitAssignments.filter(permit => permit.status === 'approved'))
    setRequested(permitAssignments.filter(permit => permit.status === 'requested'))
  }, [permitAssignments])

  const getPermitNumbers = (permits: WellPermitAssignment[], length = 5) => {
    const permitNumbers = permits.map(permit => permit.permit ?? '').slice(0, length).join(' ')
    if (permits.length > length) permitNumbers.concat(' ...')
    return permitNumbers
  }

  return (
    <span>
      {permitAssignments && <>
        {requested && requested.length > 0 &&
          <Tooltip title={getPermitNumbers(requested)} arrow={true}>
            <span className="px-3 py-1 bg-violet-200 text-violet-700 rounded font-semibold">
              {requested.length} requested
            </span>
          </Tooltip>
        }
        {approved && approved.length > 0 &&
        <Tooltip title={getPermitNumbers(approved)} arrow={true}>
          <span className="ml-2 px-3 py-1 bg-emerald-200 text-emerald-700 rounded font-semibold">
            {approved.length} approved
          </span>
        </Tooltip>
        }
      </>}
      {!permitAssignments && 
        <span className=" px-16 rounded-full bg-gradient-to-r from-primary via-white to-primary bg-opacity-10 background-animate text-white">
          loading . . .
        </span>
      }
    </span>
  )
}

export default WellPermitsCellRenderer