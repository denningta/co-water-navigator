import { query } from "faunadb";
import { NextApiRequest, NextApiResponse } from "next";
import { Validator } from "react";
import MeterReading from "../../../../interfaces/MeterReading";
import { HttpError } from "../interfaces/HttpError";

export interface ValidatorFunction {
  (req: NextApiRequest): (HttpError | HttpError[]) | 'passed'
}

let response: (HttpError | HttpError[]) | 'passed';


const queryExists: ValidatorFunction = (req) => {
  response = 'passed';
  if (!req.query) {
    response = new HttpError(
      'Request Query Undefined',
      'Query parameters were not found in the request',
      400
    );
  }

  return response;
}

const bodyExists: ValidatorFunction = (req) => {
  response = 'passed';
  if (!req.body || req.body === '') {
    response = new HttpError(
      'Request Body Undefined',
      'A body was not found in the request',
      400
    );
  }

  return response;
}

const permitNumberRequired: ValidatorFunction = (req) => {
  response = 'passed';
  if(!req.query.permitNumber) {
    response = new HttpError(
      'Missing Query Parameter',
      `A value for the query paramter 'permitNumber' was missing`,
      400
    );
  }

  return response;
}

const dateRequired: ValidatorFunction = (req) => {
  response = 'passed';
  if(!req.query.date) {
    response = new HttpError(
      'Missing Query Parameter',
      `A value for the query parameter 'date' is missing`,
      400
    )
  }

  return response;
}

const validateDate = (date: string | string[]): 'valid' | 'invalid' => {
  const dates = Array.isArray(date) ? date : [date];
  const dateRegEx: RegExp = /(\d{4})\-(\d{2})/ // RegEx Format: YYYY/MM
  if (!dates.every(date => date.match(dateRegEx))) return 'invalid';
  return 'valid';
}

const validDateFormat: ValidatorFunction = (req) => {
  response = 'passed';

  if(!req.query.date) {
    return new HttpError(
      'Missing Query Parameter',
      `A value for the query parameter 'date' is missing`,
      400
    )
  }

  const { date } = req.query;
  if (validateDate(date) === 'invalid') {
    response = new HttpError(
      'Invalid parameter',
      'Incorrect format for date parameter.  Use format: YYYY-MM',
      400,
    );
  }

  return response;
}

const allowedProperties = [
  'permitNumber',
  'date',
  'flowMeter',
  'powerMeter',
  'powerConsumptionCoef',
  'pumpedThisPeriod',
  'pumpedYearToDate',
  'availableThisYear',
  'readBy',
  'comments'
];

const validateMeterReading = (meterReading: MeterReading): string[] => {
  const blockedProperties: string[] = [];

  for (const [key, value] of Object.entries(meterReading)) {
    if (!allowedProperties.includes(key)) {
      blockedProperties.push(key);
    }
  }

  return blockedProperties;
}

const validMeterReading: ValidatorFunction = (req) => {
  response = 'passed';

  if (Array.isArray(req.body)) {
    return new HttpError(
      'Multipe Records',
      'This endpoint only accepts a single meter reading record.',
      400
    );
  }

  const blockedProperties = validateMeterReading(req.body);

  if (blockedProperties.length) {
    return new HttpError(
      'Property not Allowed',
      `The property(s) [${blockedProperties}] are not allowed`,
      400
    )
  }
  
  return response;
}

const validMeterReadingsArray: ValidatorFunction = (req) => {
  response = 'passed';
  let errors: HttpError[] = [];

  req.body.forEach((bodyRecord: MeterReading) => {
    const blockedProperties = validateMeterReading(bodyRecord);
    if (blockedProperties.length) {
      errors.push(new HttpError(
        'Invalid Record',
        `Record: ${bodyRecord.permitNumber} / ${bodyRecord.date} contained invalid property(s): ${blockedProperties}`,
        400
      ));
    }

    const invalidDate = validateDate(bodyRecord.date);
    if (invalidDate === 'invalid') {
      errors.push(new HttpError(
        'Invalid Date Format',
        `Record: ${bodyRecord.permitNumber} / ${bodyRecord.date} containes an invalid date: ${bodyRecord.date}.  Format: YYYY-MM`,
        400
      ))
    }
  });

  if (errors.length) response = errors;
  return response;
}

const optionalYearValid: ValidatorFunction = (req) => {
  response = 'passed';

  const errors: HttpError[] = [];
  const { year } = req.query;

  if (!year) {
    return new HttpError(
      'Missing Query Parameter',
      `A value for the query parameter 'year' is missing`,
      400
    );
  }

  const years = Array.isArray(year) ? year : [year];

  years.forEach(year => {
    if (req.query.year && isNaN(+year) && year.length === 4) {
      errors.push(new HttpError(
        'Invalid Query',
        'You must provide a valid four digit year.',
        400
      ))
    }
  });


  return response
}

const validatorFns = {
  queryExists: queryExists,
  bodyExists: bodyExists,
  permitNumberRequired: permitNumberRequired,
  validDateFormat: validDateFormat,
  dateRequired: dateRequired,
  validMeterReading: validMeterReading,
  validMeterReadingsArray: validMeterReadingsArray,
  optionalYearValid: optionalYearValid
}


const validateQuery = (
  req: NextApiRequest, 
  validators: Array<keyof typeof validatorFns>
): HttpError[] => {
  const errors: HttpError[] = []; 
  validators.forEach(fnIndex => {
      const res = validatorFns[fnIndex](req);
      if (res === 'passed') return;
      if (res instanceof Array<HttpError>) {
        res.forEach(err => errors.push(err))
      } else {
        errors.push(res);
      }
    });

  return errors;
}

export default validateQuery;


