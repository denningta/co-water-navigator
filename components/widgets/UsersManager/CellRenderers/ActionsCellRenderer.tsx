import { ICellRendererParams } from "ag-grid-community"
import { MouseEvent, useState } from "react"
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material'
import { BsThreeDots } from "react-icons/bs"
import { MdDelete, MdEdit } from "react-icons/md"
import { useRouter } from "next/router"
import useConfirmationDialog from "../../../../hooks/useConfirmationDialog"
import { useSnackbar } from "notistack"


const ActionsCellRenderer = (params: ICellRendererParams) => {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)

  const menuItems = [
    {
      title: 'User Details',
      icon: MdEdit,
      handleMenuItemClick: () =>
        router.push(`manage-users/${encodeURIComponent(params.data.user_id)}`)
    },
  ]

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
        {menuItems && menuItems.map((item, i) =>
          <MenuItem key={`item-${i}`} onClick={() => {
            setAnchorEl(null)
            item.handleMenuItemClick()
          }}>
            <ListItemIcon>
              {item.icon({})}
            </ListItemIcon>
            <ListItemText>{item.title}</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </div>
  )
}

export default ActionsCellRenderer
