import { Dialog, DialogContent, DialogActions, DialogTitle } from "@mui/material"
import { createContext, ReactNode, useState } from "react"
import Button, { ButtonProps } from "./Button"

interface ConfirmationDialogProviderProps {
  children: ReactNode
}

export interface DialogConfig {
  title?: string
  message?: string
  confirmConfig?: ButtonProps
  cancelConfig?: ButtonProps
  confirmationMessage?: string
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
  const [confirmationMessage, setConfirmationMessage] = useState<string | undefined>(undefined)

  const openDialog = ({
    title,
    message,
    confirmConfig,
    cancelConfig,
    confirmationMessage,
    actionCallback
  }: DialogConfig) => {
    setDialogOpen(true)
    setDialogConfig({
      title,
      message,
      confirmConfig,
      cancelConfig,
      confirmationMessage,
      actionCallback
    })
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

  const handleConfirmationMessageChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmationMessage(target.value)
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
          <div className="mb-3">
            {dialogConfig.message}
          </div>
          {dialogConfig.confirmationMessage &&
            <>
              <div className="mb-3">
                {`Type "${dialogConfig.confirmationMessage}" to confirm`}
              </div>
              <div className="mb-3">
                <input
                  className="bg-gray-100 outline-primary-500 border border-gray-300 py-2 px-3 rounded w-full"
                  id="confirmationMessage"
                  name="confirmationMessage"
                  onChange={handleConfirmationMessageChange}
                  autoFocus
                />
              </div>
            </>
          }
          <DialogActions>
            <div onClick={onDismiss}>
              <Button
                title='Cancel'
                color='secondary'
                {...dialogConfig.cancelConfig}
              />
            </div>
            <div onClick={onConfirm}>
              <Button
                title='Proceed'
                disabled={
                  dialogConfig.confirmationMessage
                    ? !(confirmationMessage && dialogConfig.confirmationMessage === confirmationMessage)
                    : false
                }
                {...dialogConfig.confirmConfig}
              />
            </div>
          </DialogActions>
        </DialogContent>
      </Dialog>
      {children}
    </ConfirmationDialogContext.Provider>
  )

}

export default ConfirmationDialogProvider
