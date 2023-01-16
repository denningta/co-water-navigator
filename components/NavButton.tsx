import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { IoHome } from 'react-icons/io5'
import { tailwindColors } from '../lib/tailwindcss/tailwindConfig'

interface Props {
  title?: string
  hideTitle?: boolean
  route?: string
  size?: 'normal' | 'small'
  transitionDelay?: string
  children?: JSX.Element
}

const NavButton = ({ 
  title = '', 
  route = '/', 
  size = 'normal', 
  children
}: Props) => {
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
          className={`
            flex flex-col w-full items-center justify-center 
            hover:bg-primary-500/20 
            transition ease-in-out 
            p-3 rounded-lg cursor-pointer mb-4 h-[70px]
            `}
        >
          {/* { isActive && <div className='absolute right-0 w-[6px] h-[15px] bg-primary-500 rounded-l'></div> } */}
          <div 
            className={`
              flex items-center text-2xl transition ease-in-out 
              ${hover ? 'text-primary-500' : 'text-gray-400'}
            `}
            style={{
              color: (hover || isActive) ? tailwindColors.primary['500'] : tailwindColors.light['500']
            }}
          >
            { children || <IoHome /> }
          </div>
          <div 
            className={`
              mt-1
              text-center text-xs transition-all ease-in-out
              whitespace-nowrap overflow-hidden
              min-h-fit
              ${(hover || isActive) ? 'text-white' : 'text-gray-400'}
              ${size === 'small' ? 'opacity-0' : 'opacity-100'}
            `}
          >
            { title }
          </div>
        </div>
    </Link>
  )
}

export default NavButton