import { ICellRendererParams } from "ag-grid-community"
import { HeatmapRect } from "@visx/heatmap"
import { genBins, getSeededRandom } from "@visx/mock-data"
import { scaleLinear } from "@visx/scale"
import { Bins } from "@visx/mock-data/lib/generators/genBins"
import { Group } from "@visx/group"
import { RectCell } from "@visx/heatmap/lib/heatmaps/HeatmapRect"
import { styled, Tooltip, tooltipClasses, TooltipProps } from "@mui/material"
import React, { forwardRef } from "react"
import CircularProgressWithLabel from "../../common/CircularProgressWithLabel"
import useHeatmapSummary from "../../../hooks/useHeatmapSummary"
import Link from "next/link"

const HeatmapCellRenderer = (params: ICellRendererParams) => {
  const { data, mutate } = useHeatmapSummary(params.data.permit)

  const width = 400
  const height = 41

  const cool1 = '#9ca3af';
  const cool2 = '#22c55e';

  const currYear = new Date().getFullYear()

  let binData = []

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
      },
    )
  }

  const xScale = scaleLinear<number>({
    domain: [0, 11],
    range: [0, width]
  });

  const yScale = scaleLinear<number>({
    domain: [0, 1],
    range: [0, height]
  });

  const colorScale = scaleLinear<string>({
    range: [cool1, cool2],
    domain: [0, 24],
  });

  const opacityScale = scaleLinear<number>({
    range: [0.1, 1],
    domain: [0, 24],
  });

  const binWidth = (width) / binData.length - 10

  return (
    <div>
      <svg width={width} height={height}>
        <Group>
          <HeatmapRect
            data={binData}
            xScale={(d) => xScale(d) ?? 0}
            yScale={(d) => yScale(d) ?? 0}
            colorScale={colorScale}
            opacityScale={opacityScale}
            binWidth={binWidth}
            binHeight={26}
            gap={1}
          >
          {(heatmap) =>
            heatmap.map((heatmapBins) =>
              heatmapBins.map((bin, i) => (
                <Rectangle key={i} bin={bin} permit={params.data.permit} />
              )),
            )
          }
          </HeatmapRect>
        </Group>
      </svg>
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