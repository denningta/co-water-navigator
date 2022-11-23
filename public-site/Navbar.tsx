import Link from "next/link"
import { useRouter } from "next/router"
import { GiWaterSplash } from "react-icons/gi"
import { MdLogin } from "react-icons/md"
import Button from "../components/common/Button"

const Navbar = () => {
  const router = useRouter()

  const handleLogin = () => {
    router.push('/api/auth/login')
  }

  return (
    <div className="flex items-center p-2 px-7 h-[60px]">
      <div className="text-5xl bg-slate-100 p-2 rounded-full drop-shadow"><GiWaterSplash size={35} /></div>
      <div className="text-2xl ml-4 font-bold">Colorado Water Export</div>
      <div className="grow"></div>
      <div className="flex">
        <div className="mr-4"><Button title="Sign up" onClick={handleLogin} /></div>
        <div><Button title="Log in" color="secondary" onClick={handleLogin} /></div>
      </div>
    </div>
  )
}

export default Navbar