import { CircularProgress } from "@mui/material"
import React, { cloneElement, MouseEvent, useEffect, useState } from "react"
import { IoSearchSharp } from "react-icons/io5"

interface Props {
  title: string | JSX.Element
  icon?: JSX.Element
  isLoading?: boolean
  size?: number
  type?: 'button' | 'submit' | 'reset'
  onClick?: (e: MouseEvent) => void
}

const Button = ({ 
  icon, 
  title,
  isLoading = false,
  size = 20,
  type = 'button',
  onClick = () => {}
}: Props) => {
  const [Icon, setIcon] = useState<JSX.Element>(<div></div>)

  const handleClick = (event: MouseEvent) => {
    onClick(event)
  }

  useEffect(() => {
    if (!icon) return
    setIcon(cloneElement(icon, { size: size }))
  }, [icon, size])
  
  return (
    <button 
      className={`
        bg-primary text-white 
        hover:bg-sky-600
        px-3 py-2 
        rounded
        flex items-center drop-shadow 
        transition ease-in-out
        ${isLoading ? 'bg-gray-400 text-gray-200' : 'bg-primary'}
      `}
      onClick={handleClick}
      disabled={isLoading}
      type={type}
    >
      { !isLoading && 
        Icon
      }
      { isLoading && 
        <CircularProgress color="inherit" size={size} />
      }
      <span className="ml-2">{ title }</span>
    </button>
  )
}

export default Button