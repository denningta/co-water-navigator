import { useState } from "react"
import { MdOutlineModeEditOutline } from "react-icons/md"
import wellPermitColumnDefs, { defaultColDef } from "./well-permit-column-defs"
import DataTable from "../DataTable/DataTable"
import { useRouter } from "next/router"
import QuickSearch from "../../common/QuickSearch"
import useWellPermitsByUser from "../../../hooks/useWellPermitsByUser"
import { useUser } from "@auth0/nextjs-auth0"
import Button from "../../common/Button"
import { BiPlus } from "react-icons/bi"

interface Props {
  rowData?: any[] | undefined
}

const WellPermitsAssignment = () => {
  const { user }: any = useUser()
  const { data } = useWellPermitsByUser(user?.sub)
  const [quickFilter, setQuickFilter] = useState<string | undefined>(undefined)

  const handleChange = (value: string) => {
    setQuickFilter(value)
  }

  return (
    <div>
      <div className="flex items-center mb-4">
        <div className="text-xl font-bold">Your Well Permits</div>
      </div> 

      <QuickSearch onChange={handleChange}/>

      <div className="flex overflow-hidden">
        <div className="w-full">
          <DataTable 
            defaultColDef={defaultColDef}
            columnDefs={wellPermitColumnDefs} 
            rowData={data} 
            suppressRowClickSelection={true}
            height={520}
            quickFilter={quickFilter}
            noRowsComponent={NoRowsComponent}
          />
        </div>
      </div>

    </div>
  )
}

const NoRowsComponent = () => {
  const router = useRouter()

  const handleClick = () => {
    router.push('/well-permits')
  }

  return (
    <div className="flex flex-col items-center z-50">
      <div className="mb-4">You have not requested access to any well permits</div>
      <Button 
        title="Search and add well permits" 
        icon={<BiPlus />}
        onClick={handleClick}
      ></Button>
    </div>
  )
}

export default WellPermitsAssignment