import { CircularProgress } from "@mui/material"
import BreadcrumbsRouter from "./BreadcrumbsRouter"
import Button from "./Button"
import { TiExport } from 'react-icons/ti'

interface Props {
  permitNumber?: string
  loading?: boolean | undefined
}

const Footer = ({ permitNumber, loading }: Props) => {

  return (
    <div 
      className="
        sticky bottom-0 left-0 
        bg-white 
        -mx-8 -mb-6 
        h-[70px] 
        p-3 px-6 
        border-t
      "
    >
      <div className="grid grid-cols-3 content-center max-w-primary-col mx-auto px-6">
        <div className="flex items-center">
          <BreadcrumbsRouter />
        </div>
        <div className="flex items-center justify-center">
          { loading === false  &&
            <span className="bg-success-200 text-success-700 px-3 py-1 rounded">Saved</span>
          }
          { loading === true &&
            <div className="text-primary-500">
              <CircularProgress color="inherit" />
            </div>
          }
        </div>
        <div className="flex items-center justify-end">
          <Button title="Export" icon={<TiExport />} type="button" />
        </div>
      </div>
    </div>
  )
}

export default Footer