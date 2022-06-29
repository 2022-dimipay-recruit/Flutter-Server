import {ValidationOptions} from '../typings/CustomType';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import {NextFunction, Request, Response} from 'express';

const ajv = new Ajv({allErrors: true});
addFormats(ajv);

export function getValidationMiddleware(options: ValidationOptions) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (typeof options.params === 'object') {
      const validate = ajv.compile(options.params.valueOf());

      validate(req.params);

      if (Array.isArray(validate.errors) && validate.errors.length !== 0) {
        res.status(400);
        res.send({
          status: 'fail',
          data: {
            message:
              'Params' +
              validate.errors[0].instancePath.replace(/\//g, '.') +
              ' ' +
              validate.errors[0].message,
          },
        });

        return;
      }
    }
    if (typeof options.query === 'object') {
      const validate = ajv.compile(options.query.valueOf());

      validate(req.query);

      if (Array.isArray(validate.errors) && validate.errors.length !== 0) {
        res.status(400);
        res.send({
          status: 'fail',
          data: {
            message:
              'Query' +
              validate.errors[0].instancePath.replace(/\//g, '.') +
              ' ' +
              validate.errors[0].message,
          },
        });

        return;
      }
    }

    if (typeof options.body === 'object') {
      const validate = ajv.compile(options.body.valueOf());

      validate(req.body);

      if (Array.isArray(validate.errors) && validate.errors.length !== 0) {
        res.status(400);

        res.send({
          status: 'fail',
          data: {
            message:
              'Body' +
              validate.errors[0].instancePath.replace(/\//g, '.') +
              ' ' +
              validate.errors[0].message,
          },
        });

        return;
      }
    }

    next();

    return;
  };
}

export default getValidationMiddleware;
