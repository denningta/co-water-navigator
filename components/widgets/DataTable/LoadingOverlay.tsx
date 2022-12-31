import { CircularProgress } from "@mui/material"

const LoadingOverlay = () => {
  return (
    <span>
      <CircularProgress color="inherit" className=" text-primary-500" />
    </span>
  )
}

export default LoadingOverlay