import generateDateValue, { DateValue } from '@visx/mock-data/lib/generators/genDateValue';
import { scaleTime, scaleLinear, scaleUtc } from '@visx/scale';
import { extent } from 'd3-array';
import { MarkerCircle } from '@visx/marker';
import { curveMonotoneX } from '@visx/curve';
import { Group } from '@visx/group';
import { useTooltip, useTooltipInPortal, withTooltip } from '@visx/tooltip'
import { AxisBottom, AxisLeft } from '@visx/axis';
import { Circle, line, LinePath } from '@visx/shape';
import { localPoint } from '@visx/event';
import cityTemperature from '@visx/mock-data/lib/mocks/cityTemperature'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { voronoi, VoronoiPolygon } from '@visx/voronoi';
import genRandomNormalPoints, { PointsRange } from '@visx/mock-data/lib/generators/genRandomNormalPoints';

interface PumpedThisPeriod {
  date: string
  pumpedThisPeriod: number
}

export interface LineChartProps {
  data: any[]
  startDate?: Date
  endDate?: Date
}

const LineChart = ({ 
  data,
  startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
  endDate = new Date()
}: LineChartProps) => {
  const [pointActive, setPointActive] = useState<undefined | number>(undefined)
  const [lineActive, setLineActive] = useState<undefined | number>(undefined)
  const svgRef = useRef<SVGSVGElement>(null);
  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip<any>()
  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    detectBounds: true,
    scroll: true
  })

  const width = 700
  const height = 350
  const margin = 30

  const date = (d: PumpedThisPeriod) => d && new Date(d.date).valueOf();
  const pumpedThisPeriod = (d: PumpedThisPeriod) => d && Number(d.pumpedThisPeriod);

  const yScale = useMemo(() => scaleLinear({
    domain: [0, 35],
    range: [height - margin, margin],
    round: true,
  }), [height, margin])

  const xScale = useMemo(() => scaleTime({
    domain: [
      startDate,
      endDate
    ],
    range: [margin, width-margin],
    round: true,
  }), [startDate, endDate])

  const x = (d: PointsRange) => d[0];
  const y = (d: PointsRange) => d[1];

  const rawData = data.map((record, index) => 
    record.pumpData.map((el: any) => ({ ...el, lineId: index, permit: record.permit }))
  ).flat(1)

  const points: PointsRange[] = rawData.map((d, index) => {
    return [
        xScale(date(d) ?? 0),
        yScale(pumpedThisPeriod(d) ?? 0),
        d.lineId,
      ]
  }, [])

  const voronoiLayout = useMemo(() =>
    voronoi<PointsRange>({
      width: width,
      height: height,
      x: (d) => x(d),
      y: (d) => y(d),
    })(points),   
    [width, height, points],
  )

  const handleMouseMove = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {

      if (!svgRef.current) return
      const point = localPoint(svgRef.current, event)
      if (!point) return;
      const neighborRadius = 20
      const closest = voronoiLayout.find(point.x, point.y, neighborRadius)
      if (closest) {
        setPointActive(closest.index)
        showTooltip({
          tooltipLeft: x(closest.data),
          tooltipTop: y(closest.data),
          tooltipData: rawData[closest.index]
        })
      } else {
        setPointActive(undefined)
      }
      const closestLine = voronoiLayout.find(point.x, point.y)
      if (closestLine) {
        setLineActive(closestLine.data[2])
      } else {
        setLineActive(undefined)
      }
    },
    [showTooltip, voronoiLayout, rawData]
  )

  const handleMouseLeave = () => {
    setPointActive(undefined)
    setLineActive(undefined)
    hideTooltip()
  }

  const colors = [
    '3A86FF',
    'FFBE0B',
    'FB5607',
    'FF006E',
    '8338EC',
  ]

  return (
    <div className="relative" ref={containerRef}>
      <svg width={width} height={height} ref={svgRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <AxisBottom top={height - margin} scale={xScale} numTicks={width > 520 ? 10 : 5} />
        <AxisLeft top={0} left={margin} scale={yScale} numTicks={height > 520 ? 10 : 5} />
        <text x={-80} y={margin + 15} transform="rotate(-90)" fontSize={10}>
            Acre Feet
        </text>
          {data.map((record, index) => 
            <LinePath
              key={`linePath-${record.permit}`}
              data={record.pumpData}
              curve={curveMonotoneX}
              x={(d) => xScale(date(d) ?? 0)}
              y={(d: any) => yScale(pumpedThisPeriod(d) ?? 0)}
              opacity={lineActive === index ? 1 : 0.4}
              stroke={`#${colors[index] ?? '#3A86FF'}`}
              strokeWidth={3}
              strokeDasharray="1,2"
            />
          )}

          {points.map((point, i) => 
            <Circle 
              key={`point-${point[0]}-${i}`}
              cx={x(point)}
              cy={y(point)}
              r={4}
              fill={`#${colors[point[2]] ?? '#3A86FF'}`}
              opacity={pointActive === i ? 1 : 0.4}
            />
          )}
      </svg>
      {tooltipOpen && 
        <TooltipInPortal
          key={Math.random()}
          top={tooltipTop}
          left={tooltipLeft}
        >
          <div className='grid grid-cols-2 gap-x-4 gap-y-1'>
            <div>Permit</div>
            <div className='font-bold'>{tooltipData && tooltipData.permit}</div>
            <div>Date</div>
            <div>{tooltipData && tooltipData.date}</div>
            <div>Acre-feet Pumped</div>
            <div>{tooltipData && tooltipData.pumpedThisPeriod}</div>
          </div>
        </TooltipInPortal>
      }
    </div>
  )
}

export default LineChart