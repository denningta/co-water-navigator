/**
 * Tests meter-readings/{permitNumber}/{date} endpoint
 * 
 * @group api
 * @group meter-readings
 * @group meter-readings/{permitNumber}
 * @group meter-readings/{permitNumber}/{date}
 */

import { createMocks, RequestMethod } from "node-mocks-http";
import meterReadingHandler from ".";
import HttpProps from "../../../interfaces/HttpProps";


let method: RequestMethod = 'GET';
const { req, res }: HttpProps = createMocks();

const permitNumber = 'XX-00000'
const date = '1900-01'

req.query = {
  permitNumber: permitNumber,
  date: date
}



describe('api/[version]/meter-readings/{permitNumber}/{date}', () => {

  describe('GET and UPDATE', () => {
    beforeEach(async () => {
      req.method = 'POST';
      req.body = { flowMeter: { value: 150 } };
      const response = await meterReadingHandler(req, res)
        .catch(error => {
          console.error('Test setup failed: ', error);
        });
    });

    afterEach(async () => {
      req.method = 'DELETE';
      const response = await meterReadingHandler(req, res)
        .catch(error => {
          console.error('Test teardown failed: ', error);
        });
    });


    test('GET returns a meter reading', async () => {    
      req.method = 'GET';
      const response = await meterReadingHandler(req, res);
      expect(response).toHaveProperty('permitNumber', permitNumber);
      expect(response).toHaveProperty('date', date);
      expect(response).toHaveProperty('flowMeter', { value: 150 });
    });

    test('PATCH updates a meter reading', async () => {
      req.method = 'PATCH';
      req.body = { powerMeter: { value: 400 } };
      const response = await meterReadingHandler(req, res);
      expect(response).toHaveProperty('permitNumber', permitNumber);
      expect(response).toHaveProperty('date', date);
      expect(response).toHaveProperty('flowMeter', { value: 150 });
      expect(response).toHaveProperty('powerMeter', { value: 400 });
    });
  });

  describe('POST', () => {
    afterAll(async () => {
      req.method = 'DELETE'
      const response = await meterReadingHandler(req, res)
        .catch(error => {
          console.error('Test setup failed: ', error);
        });
    })

    test('POST creates a meter reading', async () => {
      req.method = 'POST';
      req.body = { flowMeter: { value: 200 } };
      const response = await meterReadingHandler(req, res);
      expect(response).toHaveProperty('permitNumber', permitNumber);
      expect(response).toHaveProperty('date', date);
      expect(response).toHaveProperty('flowMeter', { value: 200 });
    });
  });

  describe('DELETE', () => {
    beforeAll(async () => {
      req.method = 'POST';
      req.body = { flowMeter: { value: 200 } };
      const response = await meterReadingHandler(req, res)
        .catch(error => {
          console.error('Test setup failed: ', error);
        });
    })

    test('DELETE deletes a meter reading', async () => {
      req.method = 'DELETE'
      const response = await meterReadingHandler(req, res);
      expect(response).toHaveProperty('permitNumber', permitNumber);
      expect(response).toHaveProperty('date', date);
      expect(response).toHaveProperty('flowMeter', { value: 200 });
    });
  });

});