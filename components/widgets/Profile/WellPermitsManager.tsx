import { Role } from 'auth0'
import { MouseEvent, useEffect, useState } from 'react'
import { FaRegTrashAlt, FaTrashAlt } from 'react-icons/fa'
import RoleTag from '../../common/RoleTag'
import { Tooltip } from '@mui/material'
import DataTable from '../DataTable/DataTable'
import wellPermitColumnDefs from '../WellPermitsAssignment/well-permit-column-defs'
import usePermitAssignments from '../../../hooks/usePermitAssignments'
import { useUser } from '@auth0/nextjs-auth0'
import { UserManagement } from '../../../interfaces/User'
import { BsCheckCircleFill } from 'react-icons/bs'
import { RowNode } from 'ag-grid-community'
import { WellPermitAssignment } from '../../../interfaces/WellPermit'

interface Props {
  user: UserManagement | undefined
}

const WellPermitsManager = ({ user }: Props) => {
  const permitAssignments = usePermitAssignments(user?.app_metadata?.permitRefs)
  const [selectedIndex, setSelectedIndex] = useState<(number | null)[]>([])
  const [permitRefs, setPermitRefs] = useState<WellPermitAssignment[] | undefined>()

  useEffect(() => {
    if (!permitAssignments) return
    setPermitRefs(permitAssignments.map(permit => 
      ({ document_id: permit.document_id, status: permit.status })  
    ))
  }, [permitAssignments])

  const handleRowSelectionChanged = (rowNodes: RowNode[]) => {
    setSelectedIndex(rowNodes.map(node => node.rowIndex))
  }

  const handleApproveAccess = () => {
    const updatedPermitRefs: WellPermitAssignment[] | undefined = permitRefs?.map((ref, i) => {
      if (selectedIndex.includes(i)) return { ...ref, status: 'approved' }
      return { ...ref }
    })
    updatePermitRefs(updatedPermitRefs)
  }

  const handleRejectAccess = () => {
    const updatedPermitRefs: WellPermitAssignment[] | undefined = permitRefs?.map((ref, i) => {
      if (selectedIndex.includes(i)) return { ...ref, status: 'rejected' }
      return { ...ref }
    })
    updatePermitRefs(updatedPermitRefs)
  }

  const updatePermitRefs = async (permitRefs: WellPermitAssignment[] | undefined) => {
    if (!permitRefs) return

    try {
      await fetch('/api/auth/user/update-app-meta-data', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ permitRefs: permitRefs })
      })
    } catch (error: any) {

    }

  }

  return (
    <div>
      <div className='flex'>
        <button
          onClick={handleApproveAccess}
          className={`flex items-center mb-4  rounded-lg py-3 drop-shadow w-fit transition ease-in-out ${(selectedIndex && selectedIndex.length > 0) ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-400'}`}
          disabled={!selectedIndex || selectedIndex.length <= 0}
        >
          <span className="border-r border-slate-300 px-4 w-28">
            { selectedIndex ? selectedIndex.length : 0 } selected
          </span>
          <div className="flex items-center px-4">
            <span className="text-xl">
              <BsCheckCircleFill className="mr-2" />
            </span>
            <span className="ml-1">Approve Access</span>
          </div>
        </button>
        <button
          onClick={handleRejectAccess}
          className={`ml-4 flex items-center mb-4  rounded-lg py-3 drop-shadow w-fit transition ease-in-out ${(selectedIndex && selectedIndex.length > 0) ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-400'}`}
          disabled={!selectedIndex || selectedIndex.length <= 0}
        >
          <span className="border-r border-slate-300 px-4 w-28">
            <span>{ selectedIndex ? selectedIndex.length : 0 }</span> selected
          </span>
          <div className="flex items-center px-4">
            <span className="text-xl">
              <FaTrashAlt className="mr-2" />
            </span>
            <span className="ml-1">Reject Access</span>
          </div>
        </button>
      </div>

      <DataTable
        rowData={permitAssignments}
        columnDefs={wellPermitColumnDefs}
        onRowSelectionChanged={handleRowSelectionChanged}
      />
    </div>
  )
}

export default WellPermitsManager