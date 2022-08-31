import Checkbox from "../../common/Checkbox"

const WellUsage = () => {
  return (
    <div className="mx-4">
      <div className="font-bold text-xl">Well Usage</div>
      <div className="grid grid-cols-1 gap-3 my-3 ml-5">
        <Checkbox title="Expanded Acres" />
        <Checkbox title="Comingled Wells" />
        <Checkbox title="Change of Use" />
        <Checkbox title="Other" />
      </div>
    </div>
  )
}

export default WellUsage