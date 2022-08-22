import { UserProvider } from "@auth0/nextjs-auth0"
import Toolbar from "./Toolbar"

interface Props {
  children: JSX.Element
}

const AppLayout = ({ children }: Props) => {
  return (
    <UserProvider>
      <div className="flex">
        <div className="absolute h-screen w-[160px]">
          <Toolbar></Toolbar>
        </div>
        <main className="ml-[160px] w-full px-8 py-6">
          { children }
        </main>
      </div>
    </UserProvider>
  )
}

export default AppLayout