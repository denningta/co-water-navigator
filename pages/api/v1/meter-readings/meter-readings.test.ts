/**
 * Tests meter-readings/{permitNumber} endpoint
 * 
 * @group api
 * @group meter-readings
 * @group meter-readings/{permitNumber}
 */

import { createMocks, RequestMethod } from "node-mocks-http";
import HttpProps from "../interfaces/HttpProps";
import meterReadingsHandler from '.';
import deleteMeterReading from "./[permitNumber]/[date]/delete";

let method: RequestMethod = 'GET';
const { req, res }: HttpProps = createMocks();

const meterReadings = [
  {
    permitNumber: 'XX-00001',
    date: '1900-01',
    flowMeter: {
      value: 150
    }
  },
  {
    permitNumber: 'XX-00001',
    date: '1900-02',
    flowMeter: {
      value: 200
    }
  },
  {
    permitNumber: 'XX-00001',
    date: '1900-03',
    flowMeter: {
      value: 250
    }
  },
];

req.body = meterReadings;
req.query = { permitNumber: 'XX-00001'};

describe('api/[version]/meter-readings/{permitNumber}', () => {

  describe('POST meter readings', () => {
    afterAll(() => {
      meterReadings.forEach(meterReading => {
        req.method = 'DELETE';
        req.query = { permitNumber: meterReading.permitNumber, date: meterReading.date }
        deleteMeterReading(req)
          .catch(error => {
            console.error('Test teardown failed: ', error);
          });
      });

    });

    test('POST creates multiple meter readings', async () => {
      req.method = 'POST';
      const response = await meterReadingsHandler(req, res);
      console.log(response);
      expect(response).toEqual(meterReadings);
    });
  });

  describe('GET meter readings', () => {

    test('GET lists meter readings', () => {

    })
  });

});
