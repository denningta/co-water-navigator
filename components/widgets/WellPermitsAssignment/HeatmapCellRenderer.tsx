import { ICellRendererParams } from "ag-grid-community"
import { HeatmapRect } from "@visx/heatmap"
import { genBins, getSeededRandom } from "@visx/mock-data"
import { scaleLinear } from "@visx/scale"
import { Bins } from "@visx/mock-data/lib/generators/genBins"
import { Group } from "@visx/group"
import { RectCell } from "@visx/heatmap/lib/heatmaps/HeatmapRect"
import { styled, Tooltip, tooltipClasses, TooltipProps } from "@mui/material"
import React, { forwardRef, useMemo } from "react"
import CircularProgressWithLabel from "../../common/CircularProgressWithLabel"
import useHeatmapSummary from "../../../hooks/useHeatmapSummary"
import Link from "next/link"
import CustomHeatmap, { CustomBinDatum, HeatmapConfig } from "../../common/visx_custom/Heatmap"

const HeatmapCellRenderer = (params: ICellRendererParams) => {
  const { data, mutate } = useHeatmapSummary(params.data.permit)

  const currYear = new Date().getFullYear()
  let binData: CustomBinDatum[] = []

  useMemo(() => {
    for (let year = currYear - 10; year <= currYear; year++) {
      binData.push(
        {
          bin: year,
          bins: [
            {
              bin: 0,
              count: (data && data.find(el => el.year === year.toString())?.percentComplete) ?? 0
            },
          ],
          href: `/well-permits/${params.data.permit}/${year}`
        },
      )
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currYear, data, params.data.permit])


  const heatmapConfig: HeatmapConfig = {
    width: 400,
    height: 41,
    color1: '#9ca3af',
    color2: '#22c55e',
    xDomain: [0, 11],
    yDomain: [0, 1],
    colorDomain: [0, 24],
    binWidth: 20,
    binHeight: 20
  }

  heatmapConfig.binWidth = (heatmapConfig.width) / binData.length - 10
  heatmapConfig.binHeight = heatmapConfig.binWidth

  return (
    <div>
      <CustomHeatmap
        binData={binData}
        config={heatmapConfig}
        tooltipComponent={(bin) =>
          <div className="flex flex-col items-center">
            <div className="font-bold text-lg">
              {bin.datum.bin}
            </div>
            <CircularProgressWithLabel value={bin.count ?? 0}></CircularProgressWithLabel>
          </div>
        }
      />
    </div>
  )
}

interface RectangleProps {
  bin: RectCell<Bins, unknown>
  permit: string
}

// eslint-disable-next-line react/display-name
const HtmlTooltip = styled(forwardRef(({ className, ...props }: TooltipProps, ref) => (
  <Tooltip {...props} classes={{ popper: className }} ref={ref} />
)))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));

HtmlTooltip.displayName = 'HtmlTooltip'

const Rectangle = ({ bin, permit }: RectangleProps) => {

  return (
    <Link href={`/well-permits/${permit}/${bin.datum.bin}`}>
      <HtmlTooltip
        title={
            <div className="flex flex-col items-center">
              <div className="font-bold text-lg">
                {bin.datum.bin}
              </div>
              <CircularProgressWithLabel value={bin.count ?? 0}></CircularProgressWithLabel>
            </div>
        }
        placement="top"
      >
        <rect
          key={`heatmap-rect-${bin.row}-${bin.column}`}
          className="hover:stroke-2 hover:stroke-primary drop-shadow cursor-pointer"
          width={bin.width}
          height={bin.height}
          x={bin.x}
          y={bin.y + 4}
          fill={bin.color}
          fillOpacity={bin.opacity}
          />
        </HtmlTooltip>
      </Link>

  )
}

export default HeatmapCellRenderer