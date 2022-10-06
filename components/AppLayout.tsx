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
          <div className="fixed h-full">
            <Toolbar></Toolbar>
          </div>
        </div>
        <main className="ml-[75px] w-full px-8 py-6">
          { children }
        </main>
      </div>
    </UserProvider>
  )
}

export default AppLayout