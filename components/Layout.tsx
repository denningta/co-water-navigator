import Toolbar from "./Toolbar"

interface Props {
  children: JSX.Element
}

const Layout = ({ children }: Props) => {
  return (
    <div className="flex">
      <div className="absolute h-screen w-[160px]">
        <Toolbar></Toolbar>
      </div>
      <main className="ml-[160px] w-full px-8 py-6">
        { children }
      </main>
    </div>
  )
}

export default Layout