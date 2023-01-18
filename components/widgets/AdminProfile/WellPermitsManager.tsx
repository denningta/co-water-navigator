import { Role } from 'auth0'
import { MouseEvent, useEffect, useState } from 'react'
import { FaRegTrashAlt, FaTrashAlt } from 'react-icons/fa'
import RoleTag from '../../common/RoleTag'
import { Tooltip } from '@mui/material'
import DataTable from '../DataTable/DataTable'
import permitManagerColDefs from './permit-manager-column-defs'
import { useUser } from '@auth0/nextjs-auth0'
import { UserManagement } from '../../../interfaces/User'
import { BsCheckCircleFill, BsXCircleFill } from 'react-icons/bs'
import { GridApi, RowNode } from 'ag-grid-community'
import { PermitRef, WellPermitAssignment } from '../../../interfaces/WellPermit'
import TableActionButton from '../../common/TableActionButton'
import { useSnackbar } from 'notistack'
import useSWR, { useSWRConfig } from 'swr'
import useWellPermitsByUser from '../../../hooks/useWellPermitsByUser'
import { tailwindColors } from '../../../lib/tailwindcss/tailwindConfig'

interface Props {
  user: UserManagement | undefined
}

const WellPermitsManager = ({ user }: Props) => {
  const { enqueueSnackbar } = useSnackbar()
  const [selectedRowNodes, setSelectedRowNodes] = useState<RowNode[]>([])
  const [api, setApi] = useState<GridApi | undefined>(undefined)
  const { data, mutate } = useWellPermitsByUser(user?.user_id)
  const [isLoading, setIsLoading] = useState({ approve: false, reject: false, delete: false })

  const getSelectedPermitRefs = () => {
    return selectedRowNodes.map(({ data }): PermitRef => ({
      document_id: data.document_id,
      permit: data.permit,
      status: data.status,
      ts: new Date().getTime()
    }))
  }

  const handleRowSelectionChanged = (rowNodes: RowNode[], api: GridApi) => {
    setSelectedRowNodes(rowNodes)
    setApi(api)
  }

  const handleApproveAccess = async () => {
    setIsLoading({ ...isLoading, approve: true })
    try {
      const res = await updateStatus('approve')
      selectedRowNodes.forEach(rowNode => rowNode.setData({ ...rowNode.data, status: 'approved'}))
      enqueueSnackbar('Update Successful!', { variant: 'success' })
      setIsLoading({ ...isLoading, approve: false })
    } catch (e) {
      enqueueSnackbar('Something went wrong - please try again', { variant: 'error' })
      setIsLoading({ ...isLoading, approve: false })
    }
  }

  const handleRejectAccess = async () => {
    setIsLoading({ ...isLoading, reject: true })
    try {
      const res = await updateStatus('reject')
      selectedRowNodes.forEach(rowNode => rowNode.setData({ ...rowNode.data, status: 'rejected'}))
      enqueueSnackbar('Update Successful!', { variant: 'success' })
      setIsLoading({ ...isLoading, reject: false })
    } catch (e) {
      enqueueSnackbar('Something went wrong - please try again', { variant: 'error' })
      setIsLoading({ ...isLoading, reject: false })
    }
  }

  const handleDeleteRequest = async () => {
    setIsLoading({ ...isLoading, delete: true })
    try {
      const document_ids = selectedRowNodes.map(rowNode => rowNode.data.document_id)
      const res = await deleteRequest(document_ids)
      api?.setRowData(res.app_metadata.permitRefs)
      enqueueSnackbar('Delete Successful', { variant: 'success' })
      setIsLoading({ ...isLoading, delete: false })
    } catch (e) {
      enqueueSnackbar('Something went wrong - please try again', { variant: 'error' })
      setIsLoading({ ...isLoading, delete: false })
    }
  }

  const updateStatus = async (action: 'approve' | 'reject') => {
    const permitRefs = getSelectedPermitRefs()
    if (!user) throw new Error('No user defined')
    const res = await fetch(
      `/api/v1/well-permits/${user.user_id}/${action}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ permitRefs: permitRefs }),
        headers: {
          'Content-Type': 'application/json'
        },
      }
    ).then(res => res.json()).catch(err => err)
    return res
  }

  const deleteRequest = async (document_ids: string[]) => {
    if (!user) throw new Error('No user defined')
    const res = await fetch(
      `/api/v1/well-permits/${user?.user_id}/delete`,
      {
        method: 'DELETE',
        body: JSON.stringify({ document_ids: document_ids }),
        headers: {
          'Content-Type': 'application/json'
        },
      }
    ).then(res => res.json())
    return res
  }

  return (
    <div>
      <div className='flex flex-col md:flex-row mb-4'>
        <TableActionButton 
          title="Approve" 
          icon={<BsCheckCircleFill />}
          numSelected={selectedRowNodes.length}
          onClick={handleApproveAccess}
          color={tailwindColors['success']['600']}
          className="mr-2"
          isLoading={isLoading.approve}
        />
        <TableActionButton 
          title="Reject" 
          icon={<BsXCircleFill />}
          numSelected={selectedRowNodes.length}
          onClick={handleRejectAccess}
          color={tailwindColors['error']['500']}
          className="mr-2"
          isLoading={isLoading.reject}
        />
        <TableActionButton 
          title="Delete" 
          icon={<FaTrashAlt />}
          numSelected={selectedRowNodes.length}
          onClick={handleDeleteRequest}
          color={"gray"}
          className="mr-2"
          isLoading={isLoading.delete}
        />
      </div>

      <DataTable
        rowData={data}
        columnDefs={permitManagerColDefs}
        onRowSelectionChanged={handleRowSelectionChanged}
      />
    </div>
  )
}

export default WellPermitsManager