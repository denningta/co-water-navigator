import { query } from "faunadb";
import { NextApiRequest, NextApiResponse } from "next";
import { Validator } from "react";
import MeterReading from "../../../../interfaces/MeterReading";
import { HttpError } from "../interfaces/HttpError";

export interface ValidatorFunction {
  (req: NextApiRequest): HttpError | 'passed'
}

let response: HttpError | 'passed';


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

const validDateFormat: ValidatorFunction = (req) => {
  response = 'passed';
  const { date } = req.query;
  const dates = Array.isArray(date) ? date : [date];
  const dateRegEx: RegExp = /(\d{4})\-(\d{2})/ // RegEx Format: YYYY/MM
  if (!dates.every(date => date.match(dateRegEx))) {
    response = new HttpError(
      'Invalid parameter',
      'Incorrect format for date parameter.  Use format: YYYY-MM',
      400,
    );
  }

  return response;
}

const validMeterReading: ValidatorFunction = (req) => {
  response = 'passed';

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

  let blockedProperties = [];

  for (const [key, value] of Object.entries(req.body)) {
    if (!allowedProperties.includes(key)) {
      blockedProperties.push(key);
      console.log(blockedProperties)
    }
  }

  if (blockedProperties.length) {
    response = new HttpError(
      'Property not Allowed',
      `The property(s) [${blockedProperties}] are not allowed`,
      400
    )
  }
  
  return response;
}

const validatorFns = {
  queryExists: queryExists,
  bodyExists: bodyExists,
  permitNumberRequired: permitNumberRequired,
  validDateFormat: validDateFormat,
  dateRequired: dateRequired,
  validMeterReading: validMeterReading,
}


const validateQuery = (req: NextApiRequest, validators: Array<keyof typeof validatorFns>) => {
  const errors = validators
    .map(fnIndex => validatorFns[fnIndex](req))
    .filter(validator => validator !== 'passed');

  return errors;
}

export default validateQuery;


