import { BsInfoLg } from "react-icons/bs"
import { ModifiedBanking } from "../../../interfaces/ModifiedBanking"
import ModifiedBankingForm from "./ModifiedBankingForm"

interface Props {
  permitNumber: string | undefined
  year: string | undefined
  modifiedBankingData: ModifiedBanking
}

const ModifiedBankingComponent = ({ year, permitNumber, modifiedBankingData }: Props) => {
  return (
    <div>
        <div className="flex items-center font-bold text-2xl mb-4">
          <div>Three Year Modified Banking (DBB-013)</div>
          <div className="grow"><span className="ml-8 mr-2 font-thin text-xl">CALENDAR YEAR</span> {year}</div>
      </div>
      { permitNumber && year && modifiedBankingData &&
        <ModifiedBankingForm 
          permitNumber={permitNumber} year={year} modifiedBankingData={modifiedBankingData} 
        />
      }
    </div>
  )
}

export default ModifiedBankingComponent