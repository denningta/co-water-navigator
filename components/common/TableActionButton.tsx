import { useEffect, useState } from "react"
import { IconType } from "react-icons"
import { BsXCircleFill, BsCheckCircleFill } from "react-icons/bs"

interface Props {
  disabled?: boolean
  icon?: JSX.Element
  onClick?: () => void
  numSelected?: number
  title?: string
  color?: string
}

const TableActionButton = ({ 
  title = '', 
  disabled = false, 
  numSelected = 0, 
  icon, 
  color = 'primary',
  onClick = () => {} 
}: Props) => {
  const [bgColor, setBgColor] = useState('#30BCED')

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
        w-fit
        ml-4 mb-4 py-3
        rounded-lg
        drop-shadow
        flex items-center
        transition ease-in-out

      `}
      style={{ 
        backgroundColor: (numSelected > 0) ? bgColor : 'rgb(226 232 240)',
        color: (numSelected > 0 ? 'white' : 'rgb(71 85 105)')
      }}
      disabled={numSelected <= 0}
    >
      <span className="border-r border-slate-300 px-4 w-28">
        <span>{ numSelected }</span> selected
      </span>
      <div className="flex items-center px-4">
        { icon  &&
          <span className="text-xl mr-2">
            { icon }
          </span>
        }
        <span className="ml-1">{ title }</span>
      </div>
    </button>
  )
}

export default TableActionButton