import { CircularProgress } from "@mui/material"
import React, { cloneElement, MouseEvent, useEffect, useState } from "react"
import { IoSearchSharp } from "react-icons/io5"

interface Props {
  title: string | JSX.Element
  icon?: JSX.Element
  isLoading?: boolean
  size?: number
  type?: 'button' | 'submit' | 'reset'
  color?: 'primary' | 'secondary'
  onClick?: (e: MouseEvent) => void
}

const Button = ({ 
  icon, 
  title,
  isLoading = false,
  size = 20,
  type = 'button',
  color = 'primary',
  onClick = () => {}
}: Props) => {
  const [Icon, setIcon] = useState<JSX.Element>()

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
        ${color === 'primary' && 'bg-primary text-white hover:bg-sky-600' }
        ${color === 'secondary' && 'bg-gray-400 text-white hover:bg-gray-500'}
        px-3 py-2 
        rounded
        flex items-center
        drop-shadow 
        transition ease-in-out
        ${isLoading && 'bg-gray-400 text-gray-200'}
      `}
      onClick={handleClick}
      disabled={isLoading}
      type={type}
    >
      { !isLoading && Icon &&
        <span className="mr-2">
          {Icon}
        </span>
      }
      { isLoading && 
        <span className="mr-2">
          <CircularProgress color="inherit" size={size} />
        </span>
      }
      <span>{ title }</span>
    </button>
  )
}

export default Button