import { IoHome, IoUmbrellaSharp } from "react-icons/io5"
import { FaUserCircle, FaListAlt } from "react-icons/fa"
import { GiWaterSplash } from "react-icons/gi"
import { MdLogout } from "react-icons/md"
import Image from 'next/image'
import NavButton from "./NavButton"
import { useUser } from "@auth0/nextjs-auth0"
import Link from "next/link"

const Toolbar = () => {
  const { user, error, isLoading } = useUser()

  return (
    <div className="flex flex-col items-center bg-black text-white p-6 h-full">
        <Link href={'/'}>
          <div className="p-4 mb-8 text-5xl cursor-pointer">
            <GiWaterSplash />
          </div>
        </Link>
      <NavButton title="Dashboard" route="/"><IoHome/></NavButton>
      <NavButton title="Well Permits" route="/well-permits"><FaListAlt/></NavButton>
      <NavButton title="Profile" route="/profile"><FaUserCircle/></NavButton>
      <div className="grow"></div>
      { user &&
        <div className="flex flex-col items-center mb-6">
          <div className="text-gray-500 text-xs text-center mb-4">ACCOUNT</div>
          <div className="flex flex-col items-center mb-8">
            {user.picture && 
              <Image 
                src={user.picture}
                alt='Profile picture'
                width={50}
                height={50}
                className="rounded-full overflow-hidden"
              />
            }
            <div className="text-sm text-gray-400 mt-2">{`${user.name}`}</div>
          </div>
          
          <Link href="/api/auth/logout">
            <button className="flex items-center bg-gray-800 hover:bg-gray-700 transition ease-in-out p-2 px-4 rounded-lg cursor-pointer">
              <MdLogout className="mr-3"/>
              Logout
            </button>
          </Link>

        </div>
      }
    </div>
  )
}

export default Toolbar