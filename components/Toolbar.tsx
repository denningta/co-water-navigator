import { IoHome } from "react-icons/io5"
import { FaUserCircle, FaListAlt, FaUserShield } from "react-icons/fa"
import { GiWaterSplash } from "react-icons/gi"
import Image from 'next/image'
import NavButton from "./NavButton"
import { useUser } from "@auth0/nextjs-auth0"
import Link from "next/link"
import { useEffect, useState } from "react"
import LogoutButton from "./common/LogoutButton"
import { TiExport } from "react-icons/ti"
import useTailwindBreakpoints from "../hooks/useTailwindBreakpoints"
import { IoSearchSharp } from "react-icons/io5"

const Toolbar = () => {
  const { user, error, isLoading } = useUser()
  const breakpoint = useTailwindBreakpoints()
  const [ collapsed, setCollapsed ] = useState(true)
  const admin = user && (user['coWaterExport/roles'] as string[]).includes('admin')

  useEffect(() => {
    if (breakpoint === 'sm') setCollapsed(false)
  }, [breakpoint])

  const handleMouseEnter = () => {
    setCollapsed(false)
  }

  const handleMouseLeave = () => {
    setCollapsed(breakpoint === 'sm' ? false : true)
  }
  
  return (
    <div 
      className={`
        flex flex-col items-center 
        bg-dark drop-shadow-lg 
        text-white 
        h-full 
        transition-all ease-in-out 
        duration-100
        w-[150px]
        ${collapsed ? 'md:w-[75px]' : 'md:w-[150px] px-4'}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={'/'}>
        <div className="p-4 mb-8 text-5xl cursor-pointer">
          <GiWaterSplash />
        </div>
      </Link>
        <div 
          className={`
            min-h-fit 
            ${collapsed ? 'overflow-y-hidden' : 'overflow-y-auto'}
          `}
        >
          <NavButton title="Dashboard" route="/dashboard" size={collapsed ? 'small' : 'normal'}>
            <IoHome/>
          </NavButton>
          <NavButton title="Well Permits" route="/well-permits" size={collapsed ? 'small' : 'normal'}>
            <FaListAlt/>
          </NavButton>
          <NavButton title="Search Permits" route="/search" size={collapsed ? 'small' : 'normal'}>
            <IoSearchSharp/>
          </NavButton>
          <NavButton title="Export" route="/export" size={collapsed ? 'small' : 'normal'}>
            <TiExport />
          </NavButton>
          <NavButton title="Profile" route="/profile" size={collapsed ? 'small' : 'normal'}>
            <FaUserCircle/>
          </NavButton>
          {admin &&
            <NavButton title="Manage Users" route="/manage-users" size={collapsed ? 'small' : 'normal'}>
              <FaUserShield />
            </NavButton>
          }
        </div>
        <div className="grow"></div>
        { user &&
          <div className="flex flex-col items-center mb-6">
            <div className={`text-gray-500 text-xs text-center mb-4 ${collapsed ? 'opacity-0' : 'opacity-100'}`}>ACCOUNT</div>
            <Link href="/profile">
              <div className="flex flex-col items-center mb-8 cursor-pointer">
                {user.picture &&
                  <div
                    className={`
                      transition-all ease-in-out
                      ${collapsed ? 'w-[30px]' : 'w-[50px]'}
                    `}
                  >
                    <Image
                      src={user.picture}
                      alt='Profile picture'
                      width={50}
                      height={50}
                      className="rounded-full overflow-hidden"
                    />
                  </div>
                }
                <div className={`text-sm text-gray-400 mt-2 whitespace-nowrap ${collapsed ? 'opacity-0' : 'opacity-100'}`}>{`${user.name}`}</div>
              </div>
            </Link>
        
            <LogoutButton size={collapsed ? 'small' : 'normal'} />
          </div>
        }
    </div>
  )
}

export default Toolbar