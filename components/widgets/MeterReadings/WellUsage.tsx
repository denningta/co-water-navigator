import Checkbox from "../../common/Checkbox"

const WellUsage = () => {
  return (
    <div className="mx-4">
      <div className="font-bold text-xl">Well Usage</div>
      <div className="grid grid-cols-1 gap-3 my-3 ml-5">
        <Checkbox title="Expanded Acres" value="expandedAcres" />
        <Checkbox title="Comingled Wells" value="comingledWells" />
        <Checkbox title="Change of Use" value="changeOfUse" />
        <Checkbox title="Other" value="other" />
      </div>
    </div>
  )
}

export default WellUsage