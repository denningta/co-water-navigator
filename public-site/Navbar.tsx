import Link from "next/link"
import { GiWaterSplash } from "react-icons/gi"
import { MdLogin } from "react-icons/md"

const Navbar = () => {
  return (
    <div className="flex items-center bg-black text-white p-4 px-7">
      <div className="text-5xl"><GiWaterSplash /></div>
      <div className="text-2xl ml-4">Colorado Water Export</div>
      <div className="grow"></div>
      <div>
        <Link href="/api/auth/login">
          <button className="flex items-center bg-gray-800 hover:bg-gray-700 transition ease-in-out p-2 px-4 rounded-lg cursor-pointer">
            <MdLogin className="mr-3"/>
            Login
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Navbar