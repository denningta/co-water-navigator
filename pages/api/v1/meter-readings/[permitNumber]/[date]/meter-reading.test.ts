/**
 * Tests meter-readings/{permitNumber}/{date} endpoint
 * 
 * @group api
 * @group meter-readings
 * @group meter-readings/{permitNumber}
 * @group meter-readings/{permitNumber}/{date}
 */

import { createMocks, RequestMethod } from "node-mocks-http";
import HttpProps from "../../../interfaces/HttpProps";
import MeterReading from "../../../../../../interfaces/MeterReading";
import listMeterReading from "./list";
import createMeterReading from "./create";
import { HttpError } from "../../../interfaces/HttpError";

const method: RequestMethod = 'POST';
const { req, res }: HttpProps = createMocks({ method });

const permitNumber = 'XX-00000'
const date = '1900-01'

req.query = {
  permitNumber: permitNumber,
  date: date
}

describe('api/[version]/meter-readings/{permitNumber}/{date}', () => {

  it('POST creates a single meter reading record', async () => {
    req.method = 'POST';
    req.body = {
      flowMeter: {
        value: 150,
      },
    }

    const response = await createMeterReading(req);
    expect(response).toBeTruthy();
    expect(response.permitNumber).toEqual('XX-00000');
    expect(response.date).toEqual('1900-01');
    expect(response.flowMeter?.value).toEqual(150);
  });

  it('GET returns a single meter reading record', async () => {
    req.method = 'GET';
    const response = await listMeterReading(req).then(res => res).catch(err => err);

    expect(response).toBeTruthy();
    expect(response.permitNumber).toEqual('XX-00000');
    expect(response.date).toEqual('1900-01');
  });

});