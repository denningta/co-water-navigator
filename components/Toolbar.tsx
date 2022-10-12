import { IoHome } from "react-icons/io5"
import { FaUserCircle, FaListAlt, FaUserShield } from "react-icons/fa"
import { GiWaterSplash } from "react-icons/gi"
import Image from 'next/image'
import NavButton from "./NavButton"
import { useUser } from "@auth0/nextjs-auth0"
import Link from "next/link"
import { useState } from "react"
import LogoutButton from "./common/LogoutButton"
import { TiExport } from "react-icons/ti"

const Toolbar = () => {
  const { user, error, isLoading } = useUser()
  const [ collapsed, setCollapsed ] = useState(true)

  const handleMouseEnter = () => {
    setCollapsed(false)
  }

  const handleMouseLeave = () => {
    setCollapsed(true)
  }
  
  return (
    <div 
      className={`flex flex-col items-center bg-black drop-shadow-lg text-white h-full transition-all ease-in-out ${collapsed ? 'w-[75px]' : 'w-[150px] px-4'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={'/'}>
        <div className="p-4 mb-8 text-5xl cursor-pointer">
          <GiWaterSplash />
        </div>
      </Link>
      <NavButton title="Dashboard" route="/dashboard" size={collapsed ? 'small' : 'normal'}>
        <IoHome/>
      </NavButton>
      <NavButton title="Well Permits" route="/well-permits" size={collapsed ? 'small' : 'normal'}>
        <FaListAlt/>
      </NavButton>
      <NavButton title="Export" route="/export" size={collapsed ? 'small' : 'normal'}>
        <TiExport />
      </NavButton>
      <NavButton title="Profile" route="/profile" size={collapsed ? 'small' : 'normal'}>
        <FaUserCircle/>
      </NavButton>
      <NavButton title="Manage Users" route="/manage-users" size={collapsed ? 'small' : 'normal'}>
        <FaUserShield />
      </NavButton>
      <div className="grow"></div>
      { user &&
        <div className="flex flex-col items-center mb-6">
          { !collapsed && <div className="text-gray-500 text-xs text-center mb-4">ACCOUNT</div> }
          <div className="flex flex-col items-center mb-8">
            {user.picture && 
              <Image 
                src={user.picture}
                alt='Profile picture'
                width={collapsed ? 30 : 50}
                height={collapsed ? 30 : 50}
                className="rounded-full overflow-hidden"
              />
            }
            { !collapsed && <div className="text-sm text-gray-400 mt-2">{`${user.name}`}</div> }
          </div>
          
          <LogoutButton size={collapsed ? 'small' : 'normal'} />

        </div>
      }
    </div>
  )
}

export default Toolbar