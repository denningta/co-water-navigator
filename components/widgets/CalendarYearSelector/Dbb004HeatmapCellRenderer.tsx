import { ICellRendererParams } from "ag-grid-community";
import MeterReading from "../../../interfaces/MeterReading";
import { useEffect, useRef, useState } from "react";
import CustomHeatmap, { CustomBinDatum, HeatmapConfig } from "../../common/visx_custom/Heatmap";
import { divide } from "lodash";
import { CalendarYearSelectorData } from "./CalendarYearSelector";

const Dbb004HeatmapCellRenderer = (
  cellData: ICellRendererParams<CalendarYearSelectorData>
) => {
  const data = cellData.data?.dbb004Summary
  const [binData, setBinData] = useState<CustomBinDatum[]>([
    { bin: '01', bins: [{ bin: 0, count: 0 }]},
    { bin: '02', bins: [{ bin: 0, count: 0 }]},
    { bin: '03', bins: [{ bin: 0, count: 0 }]},
    { bin: '04', bins: [{ bin: 0, count: 0 }]},
    { bin: '05', bins: [{ bin: 0, count: 0 }]},
    { bin: '06', bins: [{ bin: 0, count: 0 }]},
    { bin: '07', bins: [{ bin: 0, count: 0 }]},
    { bin: '08', bins: [{ bin: 0, count: 0 }]},
    { bin: '09', bins: [{ bin: 0, count: 0 }]},
    { bin: '10', bins: [{ bin: 0, count: 0 }]},
    { bin: '11', bins: [{ bin: 0, count: 0 }]},
    { bin: '12', bins: [{ bin: 0, count: 0 }]},
  ])

  useEffect(() => {
    if (!data) return
    setBinData(binData.map((el, i) => {

      const flowMeter = data.find(meterReading => {

        const date = meterReading.date.split('-')
        return (
          date[0] === cellData.data?.year &&
          date[1] === el.bin
        )
      }
      )?.flowMeter

      const bin = {
        ...el,
        bins: [{ bin: 0, count: flowMeter ? 100 : 0 }],
      }

      if (flowMeter?.calculationState === 'warning') bin.overrideColor = '#ff007f'

      return bin
    }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])


  const heatmapConfig: HeatmapConfig = {
    width: 400,
    height: 41,
    color1: '#9ca3af',
    color2: '#22c55e',
    xDomain: [0, 11],
    yDomain: [0, 1],
    colorDomain: [0, 1],
    binWidth: 20,
    binHeight: 20
  }


  return (
    <CustomHeatmap 
      binData={binData}
      config={heatmapConfig}
      tooltipComponent={
        (bin) => {
          const month = new Date(Date.UTC(2022, +bin.datum.bin - 1)).toLocaleDateString('en-us', {month: 'long'})
          return (
            <div>{month}</div>
          )
        }
      }
    />

  )


}

export default Dbb004HeatmapCellRenderer

