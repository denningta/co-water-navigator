import { useEffect, useState } from "react"
import { IconType } from "react-icons"
import { BsXCircleFill, BsCheckCircleFill } from "react-icons/bs"
import { tailwindColors } from "../../lib/tailwindcss/tailwindConfig"
import { CircularProgress } from "@mui/material"

interface Props {
  disabled?: boolean
  isLoading?: boolean
  icon?: JSX.Element
  onClick?: () => void
  numSelected?: number
  title?: string
  color?: string
  className?: string
}

const TableActionButton = ({ 
  title = '', 
  disabled = false, 
  isLoading = false,
  numSelected = 0, 
  icon, 
  color,
  onClick = () => {},
  className = ''
}: Props) => {
  const [bgColor, setBgColor] = useState<string | undefined>(tailwindColors['primary']['500'])

  const handleClick = () => {
    onClick()
  }

  useEffect(() => {
    setBgColor(color)
  }, [numSelected, color])

  return (
    <button
      onClick={handleClick}
      className={`
        ${className}
        w-fit
        py-2
        rounded-lg
        drop-shadow
        flex items-center
        transition ease-in-out
        ${numSelected > 0 ? 'cursor-pointer' : 'cursor-not-allowed'}
      `}
      style={{ 
        backgroundColor: (numSelected > 0) ? bgColor : tailwindColors['disabled'],
        color: tailwindColors['light']
      }}
      disabled={numSelected <= 0}
    >
      <span className="border-r border-slate-300 px-4 w-28">
        <span>{ numSelected }</span> selected
      </span>
      <div className="flex items-center px-4">
        { icon &&
          <span className="text-xl mr-2 flex items-center">
            { !isLoading ? icon : <CircularProgress color="inherit" size={20} /> }
          </span>
        }
        <span className="ml-1">{ title }</span>
      </div>
    </button>
  )
}

export default TableActionButton