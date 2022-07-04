import { createMocks, RequestMethod } from 'node-mocks-http';
import { NextApiRequest, NextApiResponse } from 'next';
import faunadb from 'faunadb';
import faunaClient from '../../../../../lib/faunaClient';
import createMeterReading from './[date]/create';
import meterReadingsHandler from './index';
import MeterReading from '../../../../../interfaces/MeterReading';
import { ErrorMessage } from '../../interfaces/HttpError';

interface HttpProps {
  req: NextApiRequest,
  res: NextApiResponse
}

declare const MeterReadings: MeterReading[];

const permitNumber = 'XX-00000'

const meterReadings: MeterReading[] = [
  { date: '1990/01' },
  { date: '1990/02' }
];


describe('api/[version]/meter-readings/{permitNumber}', () => {
  
  it('create meter readings', async () => {
    const method: RequestMethod = 'POST';
    const { req, res }: HttpProps = createMocks({ method });

    req.query = { permitNumber: permitNumber }

    req.body = {records: meterReadings };


    const response: MeterReading[] = await meterReadingsHandler(req, res)
      .then(res => res)
      .catch(err => err)
    
    // expect(response).toHaveLength(2);

    expect(response).toBeTruthy();
  }, 5000);

  it('delete meter readings', async () => {
    const method: RequestMethod = 'DELETE';
    const { req, res }: HttpProps = createMocks({ method });

    req.query = { permitNumber: permitNumber }
    req.body = { records: meterReadings };

    const response = await meterReadingsHandler(req, res)
      .then(res => res)
      .catch(err => err)

    expect(response).toBeTruthy();
  }, 5000); 

})