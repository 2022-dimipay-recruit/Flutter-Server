// import {ParameterizedContext} from 'koa';
import {REQUIRED_ENVIRONMENT_VARIABLE_NAMES} from '../lib/Environment';
import {
  ArraySchema,
  BooleanSchema,
  ExtendedSchema,
  IntegerSchema,
  NullSchema,
  NumberSchema,
  ObjectSchema,
  StringSchema,
} from 'fluent-json-schema';

declare global {
  namespace NodeJS {
    interface ProcessEnv
      extends Record<
        typeof REQUIRED_ENVIRONMENT_VARIABLE_NAMES[number],
        string
      > {
      NODE_ENV: 'development' | 'production';
    }
  }
}

export type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';

interface NormalResponse {
  status: 'success' | 'fail';
  data: Record<string, any> | null;
}

interface ErrorResponse {
  status: 'error';
  message: string;
  code?: number;
  data?: NormalResponse['data'];
}

export type GeneralSchema =
  | StringSchema
  | NumberSchema
  | IntegerSchema
  | BooleanSchema
  | ObjectSchema
  | ArraySchema;

export interface InferSchemaMap {
  string: StringSchema;
  number: NumberSchema;
  boolean: BooleanSchema;
  integer: IntegerSchema;
  object: ObjectSchema;
  array: ArraySchema;
  null: NullSchema;
}

export interface ValidationOptions {
  body?: ObjectSchema | ExtendedSchema;
  params?: ObjectSchema | ExtendedSchema;
  query?: ObjectSchema | ExtendedSchema;
}

export interface Page {
  size: number;
  index: number;
  order?: 'asc' | 'desc';
}

// export type Context = ParameterizedContext<
//   {
//     body: string;
//   },
//   Record<string, any>,
//   NormalResponse | ErrorResponse
// >;
