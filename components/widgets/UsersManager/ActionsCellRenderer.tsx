import { ICellRendererParams } from "ag-grid-community"
import { MouseEvent, useEffect, useState } from "react"
import { WellPermitAssignment } from "../../../interfaces/WellPermit"
import { ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from '@mui/material'
import { BsThreeDots } from "react-icons/bs"
import { MdEdit } from "react-icons/md"
import { useRouter } from "next/router"

const ActionsCellRenderer = (params: ICellRendererParams) => {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelection = () => {
    handleClose()
    router.push(`manage-users/${encodeURIComponent(params.data.user_id)}`)
  }

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
        <MenuItem onClick={handleSelection}>
          <ListItemIcon><MdEdit /></ListItemIcon>
          <ListItemText>User Details</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  )
}

export default ActionsCellRenderer