import { ICellRendererParams } from "ag-grid-community";
import { Divide } from "faunadb";
import { AdministrativeReport } from "../../../interfaces/AdministrativeReport";
import MeterReading from "../../../interfaces/MeterReading";
import { HeatmapRect } from "@visx/heatmap";
import { ClassAttributes, useRef } from "react";

const Dbb004SummaryCellRenderer = (
  cellData: ICellRendererParams<MeterReading[]>
) => {
  const heatmapRef = useRef<HTMLDivElement>(null)
  const { value }: { value: MeterReading[] } = cellData
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const getMonth = (dateString: string) => +dateString.split('-')[1]

  return (
    <div className="flex items-center h-full" ref={heatmapRef}>
      <span>Jan</span>
      {
        months.map((month, index) => {
          const record = value && value.find(el => getMonth(el.date) === (index + 1))
          let bgColor = 'gray'

          if (record && (record.flowMeter || (record.powerMeter && record.powerConsumptionCoef))) {
            bgColor = 'lightgreen'
          }

          if ( 
            record &&
            (record['flowMeter']?.calculationState === 'warning' ||
            record['powerMeter']?.calculationState === 'warning' ||
            record['powerConsumptionCoef']?.calculationState === 'warning' ||
            record['pumpedThisPeriod']?.calculationState === 'warning' ||
            record['pumpedYearToDate']?.calculationState === 'warning' ||
            record['availableThisYear']?.calculationState === 'warning')
          ) {
            bgColor = 'salmon'
          }

          return (
            <div 
              key={index} 
              className={`ml-2 w-[15px] h-[15px] bg-gray-500 border border-black`}
              style={{ backgroundColor: bgColor }} />
          )
        })
      }
      <span className="ml-2">Dec</span>
    </div>
  )

}

export default Dbb004SummaryCellRenderer