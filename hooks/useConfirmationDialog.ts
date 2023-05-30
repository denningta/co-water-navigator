import { useContext } from "react";
import { ConfirmationDialogContext } from "../components/common/ConfirmationDialogProvider";

const useConfirmationDialog = () => {
  const { openDialog } = useContext(ConfirmationDialogContext);

  const getConfirmation = ({ ...options }) =>
    new Promise((res) => {
      openDialog({ actionCallback: res, ...options });
    });

  return { getConfirmation };
}

export default useConfirmationDialog
