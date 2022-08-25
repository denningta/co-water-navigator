const WellUsage = () => {
  return (
    <div className="mx-4">
      <div className="font-bold text-xl">Well Usage</div>
      <div className="grid grid-cols-1 gap-3 my-3 ml-5">
        <div>
          <input type="checkbox" name="expandedAcres" id="expandedAcres" />
          <label className="col-span-5 ml-3">Expanded Acres</label>
        </div>
        <div>
          <input type="checkbox" name="comingledWells" id="comingledWells" />
          <label className="col-span-5 ml-3">Comingled Wells</label>
        </div>
        <div>
          <input type="checkbox" name="changeOfUse" id="changeOfUse" />
          <label className="col-span-5 ml-3">Change of Use</label>
        </div>
        <div>
          <input type="checkbox" name="other" id="other" />
          <label className="col-span-5 ml-3">Other</label>
        </div>
      </div>
    </div>
  )
}

export default WellUsage