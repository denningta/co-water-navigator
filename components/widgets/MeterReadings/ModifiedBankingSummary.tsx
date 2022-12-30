import useDbb004BankingSummary from "../../../hooks/useDbb004BankingSummary"
import EditButton from "../../common/EditButton"

interface Props {
  permitNumber: string | undefined
  year: string | undefined
}

const ModifiedBankingSummary = ({ permitNumber, year }: Props) => {
  const { data } = useDbb004BankingSummary(permitNumber, year)

  return (
    <div className="relative">
      <div className="font-bold text-xl">Three Year Modified Banking (from DBB-013) 
        <span className="ml-3">
          <EditButton />
        </span>
      </div>
      <div className="grid grid-cols-6 gap-4 mt-2">
        {data?.allowedAppropriation 
          ? <div className="col-span-2 font-bold text-right">{ data.allowedAppropriation} acre-feet</div>
          : <div className="col-span-2 text-right text-gray-400">not defined</div>
        }
        <div className="col-span-4 font-thin">ALLOWED ANNUAL APPROPRIATION PER APPROVED CHANGE</div>

        {data?.pumpingLimitThisYear 
          ? <div className="col-span-2 font-bold text-right">{ data.pumpingLimitThisYear} acre-feet</div>
          : <div className="col-span-2 text-right text-gray-400">not defined</div>
        }
        <div className="col-span-4 font-thin">ALLOWED PUMPING THIS YEAR WITH 3-YEAR BANKING</div>

        {data?.flowMeterLimit 
          ? <div className="col-span-2 font-bold text-right">{ data.flowMeterLimit } acre-feet</div>
          : <div className="col-span-2 text-right text-gray-400">not defined</div>
        }
        <div className="col-span-4 font-thin">FLOW METER LIMIT</div>
      </div>
      
    </div>
  )
}

export default ModifiedBankingSummary