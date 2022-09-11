import { Dialog, DialogTitle } from "@mui/material"
import { useState } from "react"

interface Props {
  open: boolean
  onClose: () => void
}

const MeterReadingsInfoDialog = ({ open, onClose }: Props) => {

  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='lg'>
    <DialogTitle>Form DBB-004 - Meter Readings</DialogTitle>
    <div className="mx-6 mb-6">
      <div>
        INSTRUCTIONS FOR PROPER COMPLETION AND OBLIGATION OF THE ADMINISTRATIVE ENTITY IN REPORTING
      </div>
      <ol className="list-disc mt-4">
        <li>
          <span className="underline">Completing Form DBB-004</span>: Most of the Form requirements are self-explanatory. Listed below are guides for completing selected items on the Form.
          <ol className="list-decimal ml-4 mt-4">
            <li className="mt-3">
              {`The values for "Allowed Annual Appropriation Per Approved Change" and “Allowed Pumping This Year With 3-Yr Banking” are taken from Form DBB-013 (Administrative Reporting - Three Year Modified Banking), the well permit itself, or the calculated acre-feet for those using the "3-year rolling average".`}
            </li>
            <li className="mt-3">
              {`The "Water/Power Meter Limit" is intended to show the well owner the maximum reading (flow meter or power meter) that the meter should not exceed in the calendar year. Use caution in computing this value when the meter does NOT read acre-feet or kilowatt-hours.`}
            </li>
            <li className="mt-3">
              {`In the second and third columns the ( ) below "Flow Meter Reading" and "Power Meter Reading" is used to state the unit multiplier. For example, a flow meter may read in "gallons X 1000" or a power meter may read in "Kwh X 160". Use the relationship of 325,851 gallons/per acre-foot. An approved power consumption coefficient demands that the power use be in kilowatt-hours. If the power is via natural gas, the meter reading w/multiplier and calculated coefficient should be listed. Natural gas power use coefficients are not approved by the Commission for regular use in estimating acre-feet but may be useful in tracking flow meter performance.`}
            </li>
            <li className="mt-3">
              {`The "COMMENTS / NOTES" section of the form is intended to show any changes or irregularities that would aid in explaining the readings (or lack of readings). All meter serial numbers and changes should be noted. Observed irrigated acreage or acreage descriptions should be compared to that permitted. The use of any temporary power use coefficient should be noted. Any comments to the well owner should be highlighted in this section.`}
            </li>
            <li className="mt-3">
              <div>Distribution of Form DBB-004:</div>
              <div>1 copy to the well owner/operator</div>
              <div>1 copy to the Colorado Ground Water Commission</div>
              <div>1 copy to the Water Commissioner for the Designated Basin</div>
              <div>1 copy for the Ground Water Management District</div>
            </li>
          </ol>
        </li>
        <li className="mt-4">
          <div className="underline">Administrative Responsibilities</div>
          <ol className="list-decimal ml-4 mt-4">
            <li>
              <div>Frequency of Readings</div>
              <ol className="list-disc ml-4 mt-2">
                <li className="mt-2">Irrigation of Expanded Acres: At least six times per year, with one reading prior to irrigation pumping and one reading after irrigation pumping.</li>
                <li className="mt-2">Irrigation of Commingled Wells: At least three times per year, with one reading prior to irrigation pumping and one reading after irrigation pumping.</li>
                <li className="mt-2">Commercial or Municipal (year round): Monthly readings.</li>
                <li className="mt-2">Temporary Change of Use: Each week that pumping occurs while the temporary change of use is in effect and at the end of each calendar year that the temporary change of use occurred.</li>
              </ol>
            </li>
            <li className="mt-4">
              The requirements concerning the use of flow meters and power meters outlined in the Commission Policy Memorandum 95-3 must be met for wells outside of the Republican River Basin, and the requirements outlined in the Rules and Regulations Governing the Measurement of Ground Water Diversions Located In the Republican River Basin Within Water Division No. 1 must be meet for wells in the Republican River Basin. General requirements are as follows.
              <ol className="list-disc ml-4 mt-2">
                <li className="mt-2">
                  Flow Meter Certification and Operation: Newly installed flow meters must be field certified as to accuracy to their use as a measuring device before pumping. All existing installed flow meters must be field certified every four years. Certification must be done by an entity approved by the Ground Water Commission. The flow meter must be able to measure volume of water pumped within plus or minus five (5) percent of actual. The meter should have sufficient recording digits to assure that “rollover” does not occur within three years.
                </li>
                <li className="mt-2">
                  Power Consumption Coefficients: The well owner is responsible for having any power consumption coefficient determined by a certified tester. The results of the power consumption coefficient tests and the written application describing the current irrigation practice and how the coefficient was determined must be sent to the Colorado Ground Water Commission for approval. <span className="font-bold">Power consumption coefficients cannot be used until the use of such a coefficient is approved by the Commission.</span> Power consumption coefficients must be re-certified at least every four (4) years outside the Republican River Basin and every two (2) years inside the Republican River Basin.
                </li>
              </ol>
            </li>
          </ol>
        </li>
      </ol>
    </div>
  </Dialog>
  )
}

export default MeterReadingsInfoDialog