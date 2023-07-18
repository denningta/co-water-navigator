import { Role } from 'auth0'
import { useEffect, useState } from 'react'
import RoleTag from '../../common/RoleTag'
import { Checkbox, FormControlLabel, Tooltip } from '@mui/material'
import useRoles from '../../../hooks/useRoles'
import { UserManagement } from '../../../interfaces/User'
import { useSnackbar } from 'notistack'
import axios from 'axios'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import useConfirmationDialog from '../../../hooks/useConfirmationDialog'

interface Props {
}

type AvailableRoles = Role & { checked: boolean }


const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    error.message = await res.json()
    throw error
  }
  return res.json()
}

const RolesManager = ({ }: Props) => {
  const router = useRouter()
  const { user_id } = router.query
  const { data, isValidating, error } = useSWR(`/api/auth/${user_id}/get-user`, fetcher)
  const { enqueueSnackbar } = useSnackbar()
  const user = data as UserManagement
  const systemRoles = useRoles()
  const [availableRoles, setAvailableRoles] = useState<AvailableRoles[]>([])
  const { getConfirmation } = useConfirmationDialog()

  useEffect(() => {
    if (!user || !systemRoles) return
    if (!user.roles) return

    const userRoleNames = user.roles.map(r => r.name) as string[]

    const roles = systemRoles.data.map(role => {
      return {
        ...role,
        checked: userRoleNames.includes(role.name as string)
      }
    })

    setAvailableRoles(roles)
  }, [data])


  const handleRoleChange = async ({ target }: React.ChangeEvent<HTMLInputElement>, role: Role, index: number) => {
    if (!user || !user.user_id) {
      enqueueSnackbar('User or user_id is undefined')
      return
    } if (!role.id) {
      enqueueSnackbar('No role id assigned.  Please contact an administrator.')
      return
    }

    if (target.checked) {
      const confirmed = await getConfirmation({
        title: `Assign ${role.name}`,
        message: `Are you sure you want to assign the ${role.name} role to ${user.name}?`
      })

      const roles = [...availableRoles]
      roles[index].checked = true
      setAvailableRoles(roles)

      confirmed && await updateRoles([role.id], user.user_id, 'POST')


    } else {

      const roles = [...availableRoles]
      roles[index].checked = false
      setAvailableRoles(roles)
      await updateRoles([role.id], user.user_id, 'DELETE')
    }

  }

  const updateRoles = async (roles: string[], user_id: string, method: 'POST' | 'DELETE') => {
    try {
      const response = await axios({
        method: method,
        url: `/api/auth/${user_id}/roles`,
        data: { roles: roles }
      })
      enqueueSnackbar(`Success! Role was ${method === 'POST' ? 'added' : 'removed'}`, { variant: 'success' })
    } catch (error: any) {
      enqueueSnackbar('Something went wrong.  Try again.', { variant: 'error' })
    }
  }

  return (
    <>
      <div className='flex'>
        {availableRoles && availableRoles.map((role, i) =>
          <Tooltip key={i} title={role.description ?? ''}>
            <div className="mr-6">
              <FormControlLabel
                control={
                  <Checkbox
                    disableRipple
                    checked={role.checked}
                    onChange={(e) => handleRoleChange(e, role, i)}
                  />
                }
                label={
                  <RoleTag role={role} />
                }
              />
            </div>
          </Tooltip>
        )}
      </div>
    </>
  )
}

export default RolesManager
