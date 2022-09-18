import { Role } from 'auth0'
import { MouseEvent, useState } from 'react'
import { FaRegTrashAlt } from 'react-icons/fa'
import RoleTag from '../../common/RoleTag'
import { Tooltip } from '@mui/material'

interface Props {
  roles: Role[] | undefined
  onRevokeRole?: (role: Role) => void
}

const RolesManager = ({ roles, onRevokeRole = () => {} }: Props) => {
  const [hover, setHover] = useState(false)

  const handleMouseEnter = () => {
    setHover(true)
  }

  const handleMouseLeave = () => {
    setHover(false)
  }

  const handleRevokeRole = (event: MouseEvent<HTMLButtonElement>, role: Role) => {
    event.preventDefault()
    onRevokeRole(role)
  }

  return (
    <>
      {roles &&
        <div className='flex'>
          {roles.map((role, i) =>
            <div className='flex items-center mr-4' key={i} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <RoleTag  role={role}/>
              <Tooltip title="Revoke role">
                <button onClick={(e) => handleRevokeRole(e, role)}>
                  <FaRegTrashAlt />
                </button>
              </Tooltip>
            </div>
          )}
        </div>
      }
    </>
  )
}

export default RolesManager