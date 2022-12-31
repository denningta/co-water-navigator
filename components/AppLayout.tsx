import { UserProvider } from "@auth0/nextjs-auth0"
import Toolbar from "./Toolbar"
import useTailwindBreakpoints from "../hooks/useTailwindBreakpoints"
import { IoIosMenu } from "react-icons/io"
import { useRef, useState } from "react"
import useFocus from "../hooks/useFocus"

interface Props {
  children: JSX.Element
}

const AppLayout = ({ children }: Props) => {
  const breakpoint = useTailwindBreakpoints()
  const [hideToolbar, setHideToolbar] = useState(true)

  const toggleToolbar = () => {
    setHideToolbar(!hideToolbar)
  }

  return (
    <UserProvider>
      <div>
        {(breakpoint === 'sm' || breakpoint === 'md') &&
          <div className="absolute right-10 m-2 z-50">
            <button 
              type="button" 
              className="fixed bg-white rounded-sm p-1 bg-opacity-30 backdrop-blur-sm"
              onClick={toggleToolbar}
            >
              <IoIosMenu size={30} />
            </button>
          </div>
        }
        <div 
          className="fixed h-full z-40 transition-transform ease-in-out"
          style={{ transform: hideToolbar ? 'translateX(-200px)' : 'translateX(0px)' }}
        >
            <div className="h-full">
              <Toolbar></Toolbar>
            </div>
        </div>
        { !hideToolbar && (breakpoint === 'sm' || breakpoint === 'md') && 
          <div 
            className={`
            fixed z-30 bg-dark w-full h-full backdrop-blur-sm transition ease-in-out
            ${hideToolbar ? 'bg-opacity-0' : 'bg-opacity-30'}
            `}
            onClick={() => setHideToolbar(true)}
          /> 
        }
        <main className="md:ml-[75px] w-full md:px-8 md:py-6">
          { children }
        </main>
      </div>
    </UserProvider>
  )
}

export default AppLayout