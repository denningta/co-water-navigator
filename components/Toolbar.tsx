import { IoHome, IoUmbrellaSharp } from "react-icons/io5"
import { FaUserCircle, FaListAlt } from "react-icons/fa"
import { GiWaterSplash } from "react-icons/gi"
import { MdLogout } from "react-icons/md"

import NavButton from "./NavButton"

const Toolbar = () => {
  return (
    <div className="flex flex-col items-center bg-black text-white p-6 h-full">
      <div className="p-4 mb-8 text-5xl">
        <GiWaterSplash />
      </div>
      <NavButton title="Dashboard" route="/"><IoHome/></NavButton>
      <NavButton title="Profile" route="/profile"><FaUserCircle/></NavButton>
      <NavButton title="Well Permits" route="/well-permits"><FaListAlt/></NavButton>
      <div className="grow"></div>
      <div className="flex flex-col items-center mb-6">
        <div className="text-gray-500 text-xs text-center mb-4">ACCOUNT</div>
        <div className="flex flex-col items-center mb-8">
          <div className="rounded-full bg-slate-700 w-[40px] h-[40px] text-center mb-3"></div>
          <div className="text-sm text-gray-400">Tim Denning</div>
          <div className="text-xs text-gray-400 text-center">Castle Rock Water</div>
        </div>
        <button className="flex items-center bg-gray-800 hover:bg-gray-700 transition ease-in-out p-2 px-4 rounded-lg cursor-pointer">
          <MdLogout className="mr-3"/>
          Logout
        </button>
      </div>
    </div>
  )
}

export default Toolbar