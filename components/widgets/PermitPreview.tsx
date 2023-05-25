import LineChart from '../common/LineChart';
import { CircularProgress, Tab, Tabs } from '@mui/material';
import usePermitPreview from '../../hooks/usePermitPreview';
import Button from '../common/Button';
import { BiPlus } from 'react-icons/bi';
import { useRouter } from 'next/router';
import { useState } from 'react';
import AreaChart from '../common/AreaChart';

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
    <div className="overflow-x-auto">
      <Tabs value={range} onChange={handleChange}>
        <Tab label="1Y" value={1} disableRipple />
        <Tab label="2Y" value={2} disableRipple />
        <Tab label="3Y" value={3} disableRipple />
        <Tab label="5Y" value={5} disableRipple />
        <Tab label="10Y" value={10} disableRipple />
      </Tabs>
      <div>
        <LineChart data={data ?? []} startDate={startDate} endDate={endDate} />
        <AreaChart />
        {!data &&
          <div className='absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center'>
            <CircularProgress />
          </div>
        }
        {data && !data.length &&
          <div className="absolute top-0 left-0 h-full w-full flex flex-col items-center justify-center bg-dark bg-opacity-5 backdrop-blur-sm">
            <div className='text-sm mb-3'>You have not requested access to any well permits</div>
            <Button title="Add well permits" icon={<BiPlus />} onClick={handleClick} />
          </div>
        }
      </div>
    </div>
  )
}

export default PermitPreview
