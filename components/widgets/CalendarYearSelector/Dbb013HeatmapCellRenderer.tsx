import { ICellRendererParams } from "ag-grid-community"
import { useEffect, useState } from "react"
import useModifiedBanking from "../../../hooks/useModifiedBanking"
import CustomHeatmap, { CustomBinDatum, HeatmapConfig } from "../../common/visx_custom/Heatmap"
import { CalendarYearSelectorData } from "./CalendarYearSelector"

const Dbb013HeatmapCellRenderer = (params: ICellRendererParams) => {
  const data = params.data?.dbb013Summary && params.data.dbb013Summary[0]

  const [binData, setBinData] = useState<CustomBinDatum[]>([
    { bin: 'allowedAppropriation', bins: [ { bin: 0, count: 0 }] },
    { bin: 'bankingReserveLastYear', bins: [ { bin: 0, count: 0 }] },
    { bin: 'bankingReserveThisYear', bins: [ { bin: 0, count: 0 }] },
    { bin: 'changeInBankingReserveThisYear', bins: [ { bin: 0, count: 0 }] },
    { bin: 'line3', bins: [ { bin: 0, count: 0 }] },
    { bin: 'line10', bins: [ { bin: 0, count: 0 }] },
    { bin: 'maxBankingReserve', bins: [ { bin: 0, count: 0 }] },
    { bin: 'originalAppropriation', bins: [ { bin: 0, count: 0 }] },
    { bin: 'pumpingLimitNextYear', bins: [ { bin: 0, count: 0 }] },
    { bin: 'pumpingLimitThisYear', bins: [ { bin: 0, count: 0 }] },
    { bin: 'totalPumpedThisYear', bins: [ { bin: 0, count: 0 }] },
  ])

  const heatmapConfig: HeatmapConfig = {
    width: 300,
    height: 41,
    color1: '#9ca3af',
    color2: '#22c55e',
    xDomain: [0, 11],
    yDomain: [0, 1],
    colorDomain: [0, 1],
    binWidth: 20,
    binHeight: 20
  }

  useEffect(() => {
    if (!data) return
    setBinData(binData.map((el, i) => {
      const bin = {
        ...el,
        bins: [
          { bin: 0, count: data[el.bin]?.value ? 100 : 0 }
        ]
      }

      if (data[el.bin]?.calculationState === 'warning') bin.overrideColor = '#ff007f'

      return bin
    }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <div>
      <CustomHeatmap 
        binData={binData}
        config={heatmapConfig}
        tooltipComponent={(bin) =>
          <div>{bin.datum.bin}</div>
        }
      />
    </div>
  )
}

export default Dbb013HeatmapCellRenderer