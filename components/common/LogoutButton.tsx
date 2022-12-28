import Link from "next/link"
import { MdLogout } from "react-icons/md"

interface Props {
  size?: 'small' | 'normal'
}

const LogoutButton = ({ size = 'normal' }: Props) => {
  return (
    <Link href="/api/auth/logout">
      <button 
        className={`flex items-center bg-gray-800 hover:bg-gray-700 transition ease-in-out p-2 px-4 rounded-lg cursor-pointer`}>
        <MdLogout/>
        <div className={`overflow-hidden transition-all ease-in-out text-xs ${size === 'small' ? 'w-0 opacity-0' : 'w-[40px] ml-2 opacity-100'} `}>Logout</div>
      </button>
    </Link>
  )
}

export default LogoutButton
