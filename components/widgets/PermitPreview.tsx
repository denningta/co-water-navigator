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
import { divide } from 'lodash';
import Button from '../common/Button';
import { BiPlus } from 'react-icons/bi';
import { useRouter } from 'next/router';

interface PumpedThisPeriod {
  date: string
  pumpedThisPeriod: number
}

const PermitPreview = () => {
  const { data } = usePermitPreview()
  const router = useRouter()
  const [range, setRange] = useState(1)
  const [startDate, setStartDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() - 1)))
  const [endDate, setEndDate] = useState(new Date())

  const handleChange = (e: any, newValue: number) => {
    setRange(newValue)
    setStartDate(new Date(new Date().setFullYear(new Date().getFullYear() - newValue)))
  }

  const handleClick = () => {
    router.push('/well-permits')
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
        <div>
          <CircularProgress />
        </div>
      }
      { data &&
        <div>
          <LineChart data={data} startDate={startDate} endDate={endDate} />
          {!data.length &&
            <div className="absolute top-0 left-0 h-full w-full flex flex-col items-center justify-center bg-black bg-opacity-5 backdrop-blur-sm">
              <div className='text-sm mb-3'>You have not requested access to any well permits</div>
              <Button title="Add well permits" icon={<BiPlus />} onClick={handleClick} />
            </div>
          }
        </div>
      }
    </div>
  )
}

export default PermitPreview
