import generateDateValue, { DateValue } from '@visx/mock-data/lib/generators/genDateValue';
import { scaleTime, scaleLinear, scaleUtc } from '@visx/scale';
import { extent } from 'd3-array';
import { MarkerCircle } from '@visx/marker';
import { curveMonotoneX } from '@visx/curve';
import { Group } from '@visx/group';
import { withTooltip } from '@visx/tooltip'
import { AxisBottom, AxisLeft } from '@visx/axis';
import { Circle, line, LinePath } from '@visx/shape';
import { localPoint } from '@visx/event';
import cityTemperature from '@visx/mock-data/lib/mocks/cityTemperature'
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { voronoi, VoronoiPolygon } from '@visx/voronoi';
import genRandomNormalPoints, { PointsRange } from '@visx/mock-data/lib/generators/genRandomNormalPoints';

interface PumpedThisPeriod {
  date: string
  pumpedThisPeriod: number
}

const PermitPreview = () => {
  const permitData = [
    {
      permit: '31643-FP',
      pumpData: [
        { date: '2021-9', pumpedThisPeriod: 15 },
        { date: '2021-10', pumpedThisPeriod: 5 },
        { date: '2021-11', pumpedThisPeriod: 0 },
        { date: '2021-12', pumpedThisPeriod: 0 },
        { date: '2022-1', pumpedThisPeriod: 0 },
        { date: '2022-2', pumpedThisPeriod: 3 },
        { date: '2022-3', pumpedThisPeriod: 0 },
        { date: '2022-4', pumpedThisPeriod: 1 },
        { date: '2022-5', pumpedThisPeriod: 25 },
        { date: '2022-6', pumpedThisPeriod: 28 },
        { date: '2022-7', pumpedThisPeriod: 27 },
        { date: '2022-8', pumpedThisPeriod: 31 },
      ]
    },
    { 
      permit: '45829-GT',
      pumpData: [
        { date: '2021-9', pumpedThisPeriod: 18 },
        { date: '2021-10', pumpedThisPeriod: 19 },
        { date: '2021-11', pumpedThisPeriod: 21 },
        { date: '2021-12', pumpedThisPeriod: 20 },
        { date: '2022-1', pumpedThisPeriod: 20 },
        { date: '2022-2', pumpedThisPeriod: 25 },
        { date: '2022-3', pumpedThisPeriod: 22 },
        { date: '2022-4', pumpedThisPeriod: 15 },
        { date: '2022-5', pumpedThisPeriod: 18 },
        { date: '2022-6', pumpedThisPeriod: 19 },
        { date: '2022-7', pumpedThisPeriod: 18 },
        { date: '2022-8', pumpedThisPeriod: 22 },
      ]
    },
    { 
      permit: '25812-FR',
      pumpData: [
        { date: '2021-9', pumpedThisPeriod: 20 },
        { date: '2021-10', pumpedThisPeriod: 8 },
        { date: '2021-11', pumpedThisPeriod: 1 },
        { date: '2021-12', pumpedThisPeriod: 0 },
        { date: '2022-1', pumpedThisPeriod: 0 },
        { date: '2022-2', pumpedThisPeriod: 0 },
        { date: '2022-3', pumpedThisPeriod: 0 },
        { date: '2022-4', pumpedThisPeriod: 8 },
        { date: '2022-5', pumpedThisPeriod: 13 },
        { date: '2022-6', pumpedThisPeriod: 18 },
        { date: '2022-7', pumpedThisPeriod: 25 },
        { date: '2022-8', pumpedThisPeriod: 32 },
      ]
    }
  ]

  const [pointActive, setPointActive] = useState<undefined | number>(undefined)
  const [lineActive, setLineActive] = useState<undefined | number>(undefined)
  const svgRef = useRef<SVGSVGElement>(null);

  const width = 700
  const height = 350
  const margin = 30

  const date = (d: PumpedThisPeriod) => new Date(d.date).valueOf();
  const pumpedThisPeriod = (d: PumpedThisPeriod) => Number(d.pumpedThisPeriod);

  const yScale = useMemo(() => scaleLinear({
    domain: [0, 35],
    range: [height - margin, margin],
    round: true,
  }), [height, margin])

  const xScale = useMemo(() => scaleTime({
    domain: [new Date().setFullYear(2021), new Date()],
    range: [margin, width-margin],
    round: true,
  }), [width, margin])

  const x = (d: PointsRange) => d[0];
  const y = (d: PointsRange) => d[1];

  const rawData = permitData.map((record, index) => 
    record.pumpData.map(el => ({...el, lineId: index}))
  ).flat(1)

  const points: PointsRange[] = rawData.map((d, index) => {
    return [
      xScale(date(d) ?? 0),
      yScale(pumpedThisPeriod(d) ?? 0),
      d.lineId
    ]
  }, [])


  const voronoiLayout = useMemo(
    () =>
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
    [voronoiLayout]
  )

  const handleMouseLeave = () => {
    setPointActive(undefined)
    setLineActive(undefined)
  }

  const colors = [
    '3A86FF',
    'FFBE0B',
    'FB5607',
    'FF006E',
    '8338EC',
  ]

  return (
    <div className="">
      <svg width={width} height={height} ref={svgRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <AxisBottom top={height - margin} scale={xScale} numTicks={width > 520 ? 10 : 5} />
        <AxisLeft top={0} left={margin} scale={yScale} numTicks={height > 520 ? 10 : 5} />
        <text x={-80} y={margin + 15} transform="rotate(-90)" fontSize={10}>
            Acre Feet
        </text>
          {permitData.map((record, index) => 
            <LinePath
              key={`linePath-${record.permit}`}
              data={record.pumpData}
              curve={curveMonotoneX}
              x={(d) => xScale(date(d) ?? 0)}
              y={(d) => yScale(pumpedThisPeriod(d) ?? 0)}
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
    </div>
  )
}

export default PermitPreview
