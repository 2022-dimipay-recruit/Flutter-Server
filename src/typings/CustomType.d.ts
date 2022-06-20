// import {ParameterizedContext} from 'koa';
import {REQUIRED_ENVIRONMENT_VARIABLE_NAMES} from '../lib/Environment';

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

// export type Context = ParameterizedContext<
//   {
//     body: string;
//   },
//   Record<string, any>,
//   NormalResponse | ErrorResponse
// >;
