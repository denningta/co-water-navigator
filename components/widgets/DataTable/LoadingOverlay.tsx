import { CircularProgress } from "@mui/material"

const LoadingOverlay = () => {
  return (
    <span>
      <CircularProgress color="inherit" className=" text-primary" />
    </span>
  )
}

export default LoadingOverlay