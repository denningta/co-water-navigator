import { CircularProgress } from "@mui/material"
import { useRouter } from "next/router"
import React, { cloneElement, MouseEvent, useEffect, useState } from "react"

export interface ButtonProps {
  title: string | JSX.Element
  icon?: JSX.Element
  isLoading?: boolean
  size?: number
  type?: 'button' | 'submit' | 'reset'
  color?: 'primary' | 'secondary' | 'error'
  href?: string | undefined
  disabled?: boolean
  onClick?: (e: MouseEvent) => void
}

const Button = ({
  icon,
  title,
  isLoading = false,
  size = 20,
  type = 'button',
  color = 'primary',
  href,
  disabled = false,
  onClick = () => { }
}: ButtonProps) => {
  const [Icon, setIcon] = useState<JSX.Element>()
  const [style, setStyle] = useState<React.CSSProperties>({
    pointerEvents: 'all',
  })
  const router = useRouter()

  const handleClick = (event: MouseEvent) => {
    onClick(event)
    if (href) router.push(href)
  }

  useEffect(() => {
    if (!icon) return
    setIcon(cloneElement(icon, { size: size }))
  }, [icon, size])

  useEffect(() => {
    if (disabled) setStyle({
      pointerEvents: 'all',
      backgroundColor: 'gray',
      color: 'white',
      cursor: 'not-allowed'
    })
    else setStyle({
      pointerEvents: 'all',
    })
  }, [disabled])

  return (
    <button
      className={`
        ${color === 'primary' && 'bg-primary-500 text-white hover:bg-sky-600'}
        ${color === 'secondary' && 'bg-gray-100 text-gray-600 hover:bg-gray-300'}
        ${color === 'error' && 'bg-error-500 text-white hover:bg-error-600'}
        px-3 py-2 
        rounded
        flex items-center
        drop-shadow 
        transition ease-in-out
        ${isLoading && 'bg-gray-400 text-gray-200'}
        ${(disabled || isLoading) && 'cursor-not-allowed'}
      `}
      style={style}
      onClick={handleClick}
      disabled={isLoading || disabled}
      type={type}
    >
      {!isLoading && Icon &&
        <span className="mr-2 flex items-center">
          {Icon}
        </span>
      }
      {isLoading &&
        <span className="mr-2 flex items-center">
          <CircularProgress color="inherit" size={size} />
        </span>
      }
      <span>{title}</span>
    </button>
  )
}

export default Button
