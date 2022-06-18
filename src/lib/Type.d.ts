import {ParameterizedContext} from 'koa';

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

export type Context = ParameterizedContext<
  {
    body: string;
  },
  Record<string, any>,
  NormalResponse | ErrorResponse
>;
