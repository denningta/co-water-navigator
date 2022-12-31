import { styled, Tooltip, tooltipClasses, TooltipProps } from "@mui/material";
import { Group } from "@visx/group";
import { HeatmapRect } from "@visx/heatmap";
import { RectCell } from "@visx/heatmap/lib/heatmaps/HeatmapRect";
import { Bins } from "@visx/mock-data/lib/generators/genBins";
import { scaleLinear } from "@visx/scale";
import Link from "next/link";
import { forwardRef } from "react";
import CircularProgressWithLabel from "../CircularProgressWithLabel";

export interface HeatmapProps {
  binData: CustomBinDatum[]
  config: HeatmapConfig
  tooltipComponent: (bin: RectCell<CustomBinDatum, unknown>) => JSX.Element | ''
}

export interface CustomBinDatum {
  bin: string | number
  bins: { bin: number, count: number }[]
  href?: string | undefined
  overrideColor?: string
}

export interface HeatmapConfig {
  width: number
  height: number
  xDomain: [number, number]
  yDomain: [number, number]
  color1: string
  color2: string
  colorDomain: [number, number],
  binWidth: number
  binHeight: number
}

interface RectangleProps {
  bin: RectCell<CustomBinDatum, unknown>
  href: string | undefined
  tooltipComponent: (bin: RectCell<CustomBinDatum, unknown>) => JSX.Element | ''
}

const CustomHeatmap = ({
  binData,
  config,
  tooltipComponent
}: HeatmapProps) => {
  const { 
    width,
    height,
    xDomain,
    yDomain,
    color1,
    color2,
    colorDomain,
    binWidth,
    binHeight
  } = config

  const xScale = scaleLinear<number>({
    domain: xDomain,
    range: [0, width]
  });

  const yScale = scaleLinear<number>({
    domain: yDomain,
    range: [0, height]
  });

  const colorScale = scaleLinear<string>({
    range: [color1, color2],
    domain: colorDomain,
  });

  const opacityScale = scaleLinear<number>({
    range: [0.1, 1],
    domain: colorDomain,
  });

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
            binHeight={binHeight}
            gap={1}
          >
          {(heatmap) =>
            heatmap.map((heatmapBins) =>
              heatmapBins.map((bin, i) => (
                <Rectangle 
                  key={i} 
                  bin={bin} 
                  href={bin.datum.href}
                  tooltipComponent={tooltipComponent}
                />
              ))
            )
          }
          </HeatmapRect>
        </Group>
      </svg>
    </div>
  )
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

const Rectangle = ({ bin, href, tooltipComponent }: RectangleProps) => {
  const rect = 
    <HtmlTooltip
      title={tooltipComponent(bin)}
      placement="top"
    >
      <rect
        key={`heatmap-rect-${bin.row}-${bin.column}`}
        className="hover:stroke-2 hover:stroke-primary-500 drop-shadow cursor-pointer"
        width={bin.width}
        height={bin.height}
        x={bin.x}
        y={bin.y + 4}
        fill={bin.datum.overrideColor ?? bin.color}
        fillOpacity={bin.opacity}
      />
    </HtmlTooltip>

  return (
    <>
      {href && 
        <Link href={href}>
          {rect}
       </Link>
      }
      {!href && rect}
    </>
      
  )
}

export default CustomHeatmap