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
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { voronoi, VoronoiPolygon } from '@visx/voronoi';
import genRandomNormalPoints, { PointsRange } from '@visx/mock-data/lib/generators/genRandomNormalPoints';
import LineChart from '../common/LineChart';
import { CircularProgress, Select, Tab, Tabs } from '@mui/material';
import usePermitPreview from '../../hooks/usePermitPreview';

interface PumpedThisPeriod {
  date: string
  pumpedThisPeriod: number
}

const permitData = [
  {
    permit: '31643-FP',
    pumpData: [
      { date: '2021-09', pumpedThisPeriod: 15 },
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

const PermitPreview = () => {
  const { data } = usePermitPreview()
  const [range, setRange] = useState(1)
  const [startDate, setStartDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() - 1)))
  const [endDate, setEndDate] = useState(new Date())

  const handleChange = (e: any, newValue: number) => {
    setRange(newValue)
    setStartDate(new Date(new Date().setFullYear(new Date().getFullYear() - newValue)))
  }

  return (
    <div className="">
      <Tabs value={range} onChange={handleChange}>
        <Tab label="1Y" value={1} disableRipple />
        <Tab label="2Y" value={2} disableRipple />
        <Tab label="3Y" value={3} disableRipple />
        <Tab label="5Y" value={5} disableRipple />
        <Tab label="10Y" value={10} disableRipple />
      </Tabs>
      { !data &&
        <CircularProgress />
      }
      { data &&
        <LineChart data={data} startDate={startDate} endDate={endDate} />
      }
    </div>
  )
}

export default PermitPreview
