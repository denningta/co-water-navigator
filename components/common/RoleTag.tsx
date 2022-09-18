import { Role } from "auth0"
import { IoMdClose } from 'react-icons/io'

interface Props {
  role: Role
  editable?: boolean
}

const RoleTag = ({ role, editable = false }: Props) => {
  let color = 'bg-emerald-200 text-emerald-800'
  if (role.name === 'admin') color = 'bg-rose-200 text-rose-800'

  return (
    <span  className={`select-none mr-2 px-3 py-1 rounded font-semibold ${color}`}>
      {role.name && role.name.charAt(0).toUpperCase() + role.name.slice(1)}
    </span>
  )
}

export default RoleTag