import { scaleTime, scaleLinear, scaleOrdinal } from '@visx/scale';
import { curveMonotoneX } from '@visx/curve';
import { useTooltip, useTooltipInPortal } from '@visx/tooltip'
import { AxisBottom, AxisLeft } from '@visx/axis';
import { Circle, LinePath } from '@visx/shape';
import { localPoint } from '@visx/event';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { voronoi } from '@visx/voronoi';
import { PointsRange } from '@visx/mock-data/lib/generators/genRandomNormalPoints';
import _ from 'lodash';
import { LegendOrdinal } from '@visx/legend';

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

  const rawData = data.map((record, index) => 
    record.pumpData.map((el: any) => ({ ...el, lineId: index, permit: record.permit }))
  ).flat(1)

  const yScale = useMemo(() => scaleLinear({
    domain: [0, Math.max(...rawData.map(el => el.pumpedThisPeriod))],
    range: [height - margin, margin],
    round: true,
  }), [rawData])

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
        hideTooltip()
      }
      const closestLine = voronoiLayout.find(point.x, point.y)
      if (closestLine) {
        setLineActive(closestLine.data[2])
      } else {
        setLineActive(undefined)
      }
    },
    [voronoiLayout, showTooltip, rawData, hideTooltip]
  )

  const handleMouseLeave = () => {
    setPointActive(undefined)
    setLineActive(undefined)
    hideTooltip()
  }

  const ordinalDomain = _.uniq(rawData.map(el => el.permit))
  const colors = [
    '#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabed4', '#469990', '#dcbeff', '#9A6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#a9a9a9',
  ]

  const ordinalColorScale = scaleOrdinal({
    domain: ordinalDomain,
    range: colors,
  });

  const handleLegendEnter = (lineIndex: number) => {
    setLineActive(lineIndex)
  }
  const handleLegendLeave = () => {
    setLineActive(undefined)
  }

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
              stroke={ordinalDomain.includes(record.permit) ? ordinalColorScale(record.permit) : '#3A86FF'}
              strokeWidth={3}
              strokeDasharray="1,2"
            />
          )}

          {points.map((point, i) => {
            const permit = rawData.find(el => el.lineId === point[2]).permit
            return (<Circle 
              key={`point-${point[0]}-${i}`}
              cx={x(point)}
              cy={y(point)}
              r={4}
              fill={ordinalDomain.includes(permit) ? ordinalColorScale(permit) : '#3A86FF'}
              opacity={pointActive === i ? 1 : 0.4}
            />)
          })}
      </svg>
      <LegendOrdinal
        scale={ordinalColorScale}
      >
        {(labels) => (
          <div className="border w-fit py-2 px-4 rounded-lg absolute top-0 right-0 select-none">
            <div className='font-bold mb-1'>Well Permits</div>
            <div className='grid grid-cols-1 gap-x-4'>
              {labels.map((label, i) => {
                const lineId = rawData.find(el => el.permit === label.datum)?.lineId
                return (
                <div key={lineId} 
                  className="flex items-center"
                  style={{ opacity: lineActive === lineId ? 1 : 0.5 }}
                  onMouseEnter={() => handleLegendEnter(lineId)}
                  onMouseLeave={handleLegendLeave}
                >
                  <div
                    className='w-[8px] h-[8px] rounded-full bg-dark'
                    style={{ backgroundColor: label.value }}
                  />
                  <div className='ml-3'>{label.datum}</div>
                </div>
              )})}
            </div>
          </div>
        )}
      </LegendOrdinal>

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