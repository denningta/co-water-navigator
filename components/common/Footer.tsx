import { CircularProgress } from "@mui/material"
import BreadcrumbsRouter from "./BreadcrumbsRouter"
import Button from "./Button"
import { TiExport } from 'react-icons/ti'
import useTailwindBreakpoints from "../../hooks/useTailwindBreakpoints"

interface Props {
  permitNumber?: string
  loading?: boolean | undefined
}

const Footer = ({ permitNumber, loading }: Props) => {

  return (
    <div 
      className="
        bg-white 
        md:-mx-8 md:-mb-6 
        h-[55px]
        py-2 px-3
        md:h-[70px] 
        md:p-3 md:px-6 
        border-t
      "
    >
      <div className="grid grid-cols-3 content-center max-w-primary-col md:mx-auto md:px-6">
        <div className="flex items-center">
          <div className="hidden md:block">
            <BreadcrumbsRouter />
          </div>
        </div>
        <div className="flex items-center justify-center">
          { loading === false  &&
            <span className="bg-success-200 text-success-700 px-3 py-1 rounded">Saved</span>
          }
          { loading === true &&
            <div className="text-primary-500 flex items-center">
              <CircularProgress color="inherit" size={30} />
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