import Link from 'next/link'
import { useState } from 'react'
import { IoHome } from 'react-icons/io5'

interface Props {
  title?: string
  route?: string
  children?: JSX.Element
}

const NavButton = ({ title = '', route = '/', children }: Props) => {
  const [hover, setHoverState] = useState(false)

  return (
    <Link href={route}>
      <div
        onMouseEnter={() => setHoverState(true)}
        onMouseLeave={() => setHoverState(false)}
        className="flex flex-col w-full items-center hover:bg-gray-800  transition ease-in-out p-3 rounded-lg cursor-pointer mb-4"
      >
        <div className={`flex items-center text-2xl transition ease-in-out ${hover ? 'text-primary' : 'text-gray-400'}`}>
          { children   || <IoHome /> }
        </div>
        <div className={`mt-2 text-center text-sm ${hover ? 'text-white' : 'text-gray-400'}`}>{ title }</div>
      </div>
    </Link>
  )
}

export default NavButton