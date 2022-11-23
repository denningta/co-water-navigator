import { useRouter } from "next/router"
import Button from "../components/common/Button"
import Navbar from "./Navbar"

interface Props {
  children: JSX.Element[] | JSX.Element
}

const PublicLayout = ({ children }: Props) => {
  const router = useRouter()

  const handleLogin = () => {
    router.push('/api/auth/login')
  }

  return (
    <div>
      <div className="sticky top-0 z-50 backdrop-blur border-b">
        <Navbar />
      </div>
      <div>{ children }</div>
      <div className="bg-slate-600 px-6 py-10 flex justify-center mt-10">
        <div className="mr-4"><Button title="Sign up" onClick={handleLogin} /></div>
        <div><Button title="Log in" color="secondary" onClick={handleLogin} /></div>
      </div>
    </div>
  )
}

export default PublicLayout