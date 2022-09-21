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

interface Props {
  user: UserManagement | undefined
}

const WellPermitsManager = ({ user }: Props) => {
  const { enqueueSnackbar } = useSnackbar()
  const [selectedRowNodes, setSelectedRowNodes] = useState<RowNode[]>([])
  const [api, setApi] = useState<GridApi | undefined>(undefined)
  const { data, mutate } = useWellPermitsByUser(user?.user_id)

  const getSelectedPermitRefs = () => {
    return selectedRowNodes.map(({ data }): PermitRef => ({
      document_id: data.document_id,
      permit: data.permit,
      status: data.status,
      ts: new Date().getMilliseconds()
    }))
  }

  const handleRowSelectionChanged = (rowNodes: RowNode[], api: GridApi) => {
    setSelectedRowNodes(rowNodes)
    setApi(api)
  }

  const handleApproveAccess = async () => {
    selectedRowNodes.forEach(rowNode => rowNode.setData({ ...rowNode.data, status: 'approved'}))
    try {
      await mutate(updateStatus('approve'), {
        rollbackOnError: true,
        populateCache: true,
        revalidate: true
      })
      enqueueSnackbar('Update Successful!', { variant: 'success' })
    } catch (e) {
      enqueueSnackbar('Something went wrong - please try again', { variant: 'error' })
    }
  }

  const handleRejectAccess = async () => {
    selectedRowNodes.forEach(rowNode => rowNode.setData({ ...rowNode.data, status: 'rejected'}))
    try {
      await mutate(updateStatus('reject'), {
        rollbackOnError: true,
        populateCache: true,
        revalidate: true
      })
      enqueueSnackbar('Update Successful!', { variant: 'success' })
    } catch (e) {
      enqueueSnackbar('Something went wrong - please try again', { variant: 'error' })
    }
  }

  const handleDeleteRequest = () => {

  }

  const updateStatus = async (action: 'approve' | 'reject') => {
    const permitRefs = getSelectedPermitRefs()
      if (!user) throw new Error('No user defined')
      const res = await fetch(
        `/api/v1/well-permits/${user.user_id}/${action}`,
        {
          method: 'POST',
          body: JSON.stringify({ permitRefs: permitRefs }),
          headers: {
            'Content-Type': 'application/json'
          },
        }
      ).then(res => res.json()).catch(err => err)
      return res
  }

  return (
    <div>
      <div className='flex'>
        <TableActionButton 
          title="Approve" 
          icon={<BsCheckCircleFill />}
          numSelected={selectedRowNodes.length}
          onClick={handleApproveAccess}
          color="green"
        />
        <TableActionButton 
          title="Reject" 
          icon={<BsXCircleFill />}
          numSelected={selectedRowNodes.length}
          onClick={handleRejectAccess}
          color="rose"
        />
        <TableActionButton 
          title="Delete" 
          icon={<FaTrashAlt />}
          numSelected={selectedRowNodes.length}
          onClick={handleDeleteRequest}
          color="gray"
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