import EditButton from "../../common/EditButton"

const ModifiedBankingSummary = () => {
  return (
    <div className="relative">
      <div className="font-bold text-xl">Three Year Modified Banking (DBB-013) 
        <span className="ml-3">
          <EditButton />
        </span>
      </div>
      <div className="grid grid-cols-6 gap-4 mt-2">
        <div className="col-span-1 font-bold text-right">185 acre-feet</div>
        <div className="col-span-5 font-thin">ALLOWED ANNUAL APPROPRIATION PER APPROVED CHANGE</div>
        <div className="col-span-1 font-bold text-right">185 acre-feet</div>
        <div className="col-span-5 font-thin">ALLOWED PUMPING THIS YEAR WITH 3-YEAR BANKING</div>
        <div className="col-span-1 font-bold text-right">185 acre-feet</div>
        <div className="col-span-5 font-thin">FLOW METER LIMIT</div>
      </div>
      
    </div>
  )
}

export default ModifiedBankingSummary