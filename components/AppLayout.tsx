import { UserProvider } from "@auth0/nextjs-auth0"
import Toolbar from "./Toolbar"

interface Props {
  children: JSX.Element
}

const AppLayout = ({ children }: Props) => {
  return (
    <UserProvider>
      <div className="flex">
        <div className="absolute h-screen z-50">
          <Toolbar></Toolbar>
        </div>
        <main className="ml-[80px] w-full px-8 py-6">
          { children }
        </main>
      </div>
    </UserProvider>
  )
}

export default AppLayout