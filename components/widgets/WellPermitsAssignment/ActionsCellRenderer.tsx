import { ICellRendererParams } from "ag-grid-community"
import { MouseEvent, useState } from "react"
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material'
import { BsThreeDots } from "react-icons/bs"
import { MdEdit } from "react-icons/md"
import Link from "next/link"
import { IoSettingsSharp } from 'react-icons/io5'

const ActionsCellRenderer = (params: ICellRendererParams) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)

  const { permit } = params?.data ?? ''

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <span>
        <button
          onClick={handleClick}
          className="bg-gray-100 p-2 rounded hover:drop-shadow">
          <BsThreeDots />
        </button>
      </span>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem>
          <ListItemIcon><MdEdit /></ListItemIcon>
          <ListItemText>
            <Link href={`/well-permits/${permit}`}>
              Meter Readings
            </Link>
          </ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon><IoSettingsSharp /></ListItemIcon>
          <ListItemText>
            <Link href={`/well-permits/${permit}/settings`}>
              Permit Settings
            </Link>
          </ListItemText>
        </MenuItem>
      </Menu>
    </div>
  )
}

export default ActionsCellRenderer
