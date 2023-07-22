import { IHeaderParams } from "ag-grid-community"
import { BsCalculatorFill, BsLockFill } from "react-icons/bs"
import { FaUser } from "react-icons/fa"
import { Tooltip } from "@mui/material"
import { ReactNode } from "react"


const CustomHeaderRenderer = ({ displayName, api, column }: IHeaderParams) => {

  let icon: ReactNode = undefined
  let displayNameTooltip: ReactNode | string = ''
  let iconTooltip: ReactNode | string = ''


  const columnName = column.getUniqueId()

  if (['date', 'updatedBy'].includes(columnName)) {
    icon = <BsLockFill />
    iconTooltip = "Auto-generated field"
  }

  if (['flowMeter', 'powerMeter', 'powerConsumptionCoef'].includes(columnName)) {
    icon = <FaUser />
    iconTooltip = "User defined field"
  }

  if (['pumpedThisPeriod', 'pumpedYearToDate', 'availableThisYear'].includes(columnName)) {
    icon = <BsCalculatorFill />
    iconTooltip = (
      <>
        <div className="mb-1">
          Calculated field
        </div>
        <div>
          You may override calculated values.
        </div>
        <div>
          A comment must be provided to eliminate any warnings.
        </div>
      </>
    )
  }

  if (['readBy', 'comments'].includes(columnName)) {
    icon = <FaUser />
    iconTooltip = "User defined field"
  }

  if (['powerConsumptionCoef'].includes(columnName)) {
    displayNameTooltip = "Power Consumption Coefficient"
  }

  return (
    <div className="flex flex-row items-center py-2 w-full">
      <Tooltip title={displayNameTooltip} className="grow mr-2">
        <div className="">{displayName}</div>
      </Tooltip>
      <Tooltip title={iconTooltip} className="flex justify-end">
        <div>{icon}</div>
      </Tooltip>
    </div>
  )
}

export default CustomHeaderRenderer
