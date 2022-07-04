import { NextApiRequest, NextApiResponse } from "next";
import { Validator } from "react";
import { HttpError } from "../interfaces/HttpError";

export interface ValidatorFunction {
  (req: NextApiRequest): HttpError | 'passed'
}

let response: HttpError | 'passed' = 'passed';


const permitNumberRequired: ValidatorFunction = (req) => {
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
  const { date } = req.query;
  console.log(date)
  const dates = Array.isArray(date) ? date : [date];
  console.log(dates)
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

const validatorFns = {
  permitNumberRequired: permitNumberRequired,
  validDateFormat: validDateFormat,
  dateRequired: dateRequired,
}


const validateQuery = (req: NextApiRequest, validators: Array<keyof typeof validatorFns>) => {
  // const errors = validators.map(fn => fn(req)).filter(el => el !== 'passed');
  const errors = validators
    .map(fnIndex => validatorFns[fnIndex](req))
    .filter(validator => validator !== 'passed');

  response = 'passed'; // reset response

  return errors;
}

export default validateQuery;


