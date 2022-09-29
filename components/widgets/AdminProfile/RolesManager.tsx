import { Role } from 'auth0'
import { MouseEvent, useState } from 'react'
import { FaRegTrashAlt } from 'react-icons/fa'
import RoleTag from '../../common/RoleTag'
import { Tooltip } from '@mui/material'
import useRoles from '../../../hooks/useRoles'
import Select from 'react-select'
import Checkbox from '../../common/Checkbox'
import { UserManagement } from '../../../interfaces/User'
import { useSnackbar } from 'notistack'
import axios from 'axios'

interface Props {
  user: UserManagement | undefined
  assignedRoles: Role[] | undefined
  onRoleChange?: (role: Role) => void
}

const RolesManager = ({ user, onRoleChange = () => {} }: Props) => {
  const availableRoles = useRoles()
  const [hover, setHover] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const handleMouseEnter = () => {
    setHover(true)
  }

  const handleMouseLeave = () => {
    setHover(false)
  }

  const handleRoleChange = (value: string, checked: boolean, role: Role) => {
    onRoleChange(role)
    if (!user || !user.user_id) {
      enqueueSnackbar('User or user_id is undefined')
      return
    }
    if (!role.id) {
      enqueueSnackbar('No role id assigned.  Please contact an administrator.')
      return
    }
    updateRoles([role.id], user.user_id, checked ? 'POST' : 'DELETE')
  }

  const updateRoles = async (roles: string[], user_id: string, method: 'POST' | 'DELETE') => {
    try {
      const response = await axios({
        method: method,
        url: `/api/auth/${user_id}/roles`, 
        data: { roles: roles }
      })
      enqueueSnackbar('Success! Role was updated', { variant: 'success' })
    } catch (error: any) {
      enqueueSnackbar('Something went wrong.  Try again.', { variant: 'error' })
    }
  }


  return (
    <div className='flex'>
      { availableRoles?.data && user && user.roles && availableRoles.data.map((role, i) => 
        <Tooltip key={i} title={role.description ?? ''}>
          <div  className="mr-6">
            <Checkbox
              title={<RoleTag  role={role}/>}
              value={role.name}
              checked={!!(user.roles?.find(r => r.name === role.name))}
              onChange={([value, checked]) => handleRoleChange(value, checked, role)}
            />
          </div>
        </Tooltip>
      )}
    </div>
  )
}

export default RolesManager