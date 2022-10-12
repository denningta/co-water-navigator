import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { IoHome } from 'react-icons/io5'

interface Props {
  title?: string
  hideTitle?: boolean
  route?: string
  size?: 'normal' | 'small'
  children?: JSX.Element
}

const NavButton = ({ title = '', route = '/', size = 'normal', children }: Props) => {
  const [hover, setHoverState] = useState(false)
  const { pathname } = useRouter()
  const path = pathname.split('/')
  const hrefPath = route.split('/')
  const isActive = path[1] === hrefPath[1]

  return (
    <Link href={route}>
        <div
          onMouseEnter={() => setHoverState(true)}
          onMouseLeave={() => setHoverState(false)}
          className="flex flex-col w-full items-center justify-center hover:bg-primary hover:bg-opacity-20   transition ease-in-out p-3 rounded-lg cursor-pointer mb-4 h-[70px]"
        >
          { isActive && <div className='absolute right-0 w-[6px] h-[15px] bg-primary rounded-l'></div> }
          <div className={`flex items-center text-2xl transition ease-in-out ${hover ? 'text-primary' : 'text-gray-400'}`}>
            { children || <IoHome /> }
          </div>
          { size === 'normal' &&
            <div className={`
              mt-2 
              text-center text-sm 
              min-w-fit
              ${hover ? 'text-white' : 'text-gray-400'}
            `}>
              { title }
            </div>
          }
        </div>
    </Link>
  )
}

export default NavButton