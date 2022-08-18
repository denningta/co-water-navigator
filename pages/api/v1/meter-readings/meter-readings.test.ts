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
import createMeterReadings from "./create";

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

const meterReadingsAlt = [
  {
    permitNumber: 'XX-00002',
    date: '1900-01',
    flowMeter: {
      value: 150
    }
  },
  {
    permitNumber: 'XX-00002',
    date: '1900-02',
    flowMeter: {
      value: 200
    }
  },
  {
    permitNumber: 'XX-00002',
    date: '1900-03',
    flowMeter: {
      value: 250
    }
  },
  {
    permitNumber: 'XX-00002',
    date: '1901-01',
    flowMeter: {
      value: 270
    }
  },
];

describe('api/[version]/meter-readings/{permitNumber}', () => {
  describe('POST meter readings', () => {
    afterAll(() => {
      const { req, res }: HttpProps = createMocks();
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
      const { req, res }: HttpProps = createMocks();
      req.method = 'POST';
      req.body = meterReadings;
      const response = await meterReadingsHandler(req, res).catch(error => console.log(error));
      expect(response).toEqual(meterReadings);
    });
  });

  describe('GET meter readings', () => {

    beforeAll(async () => {
      const { req, res }: HttpProps = createMocks();
      req.method = 'POST';
      req.body = meterReadingsAlt;
      const response = await meterReadingsHandler(req, res)
        .catch(error => console.log('Test setup failed: ', error));
      console.log(response)
    });

    afterAll(() => {
      const { req, res }: HttpProps = createMocks();
      meterReadingsAlt.forEach(async meterReading => {
        req.method = 'DELETE';
        req.query = { permitNumber: meterReading.permitNumber, date: meterReading.date }
        await deleteMeterReading(req)
          .catch(error => {
            console.error('Test teardown failed: ', error);
          });
      });
    });

    test('GET lists meter readings', async () => {
      const { req, res }: HttpProps = createMocks();
      req.method = 'GET';
      req.query = { permitNumber: 'XX-00002', year: ['1900', '1901'] };
      const response = await meterReadingsHandler(req, res);
      expect(response).toEqual(meterReadingsAlt);
    });
  });

});
