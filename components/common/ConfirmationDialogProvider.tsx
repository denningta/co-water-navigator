import { Dialog, DialogContent, DialogActions, DialogTitle } from "@mui/material"
import { createContext, ReactNode, useState } from "react"
import Button from "./Button"

interface ConfirmationDialogProviderProps {
  children: ReactNode
}

export interface DialogConfig {
  title?: string
  message?: string
  actionCallback: (...args: any) => any
}

type OpenDialog = (props: DialogConfig) => void

export interface DialogContext {
  openDialog: OpenDialog
}

const actionCallbackDefault = () => { }
const openDialogDefault: OpenDialog = ({ actionCallback: actionCallbackDefault }) => { }

export const ConfirmationDialogContext = createContext<DialogContext>({ openDialog: openDialogDefault })

const ConfirmationDialogProvider = ({ children }: ConfirmationDialogProviderProps) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogConfig, setDialogConfig] = useState<DialogConfig>({ actionCallback: actionCallbackDefault })

  const openDialog = ({ title, message, actionCallback }: DialogConfig) => {
    setDialogOpen(true)
    setDialogConfig({ title, message, actionCallback })
  }

  const resetDialog = () => {
    setDialogOpen(false)
    setDialogConfig({ actionCallback: actionCallbackDefault })
  }

  const onConfirm = () => {
    resetDialog()
    dialogConfig.actionCallback && dialogConfig.actionCallback(true)
  }

  const onDismiss = () => {
    resetDialog()
    dialogConfig.actionCallback && dialogConfig.actionCallback(false)
  }

  return (
    <ConfirmationDialogContext.Provider value={{ openDialog }}>
      <Dialog
        open={dialogOpen}
      >
        <DialogTitle>
          {dialogConfig.title}
        </DialogTitle>
        <DialogContent>
          {dialogConfig.message}
          <DialogActions>
            <Button title='Cancel' color='secondary' onClick={onDismiss} />
            <Button title='Proceed' onClick={onConfirm} />
          </DialogActions>
        </DialogContent>
      </Dialog>
      {children}
    </ConfirmationDialogContext.Provider>
  )

}

export default ConfirmationDialogProvider
