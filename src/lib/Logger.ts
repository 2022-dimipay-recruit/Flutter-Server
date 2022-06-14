import {appendFile} from 'fs/promises';
import {join} from 'path/posix';
import {inspect} from 'util';
import {Level, LoggerOptions} from './Type';

class Logger {
  private _level = 0;
  private transports: LoggerOptions['transports'] = [];
  private levels: Record<LoggerOptions['level'], number> = {
    fatal: 5,
    error: 4,
    warn: 3,
    info: 2,
    debug: 1,
    trace: 0,
  } as const;

  constructor(options?: Partial<LoggerOptions>) {
    if (typeof options === 'object') {
      if (Array.isArray(options['transports'])) {
        this['transports'] = options['transports'];
      }

      if (typeof options['level'] === 'string') {
        this['_level'] = this['levels'][options['level']] || 0;
      }
    }
  }

  private log(level: Level, _arguments: unknown[]): void {
    if (this['levels'][level] >= this['_level']) {
      for (let i = 0; i < _arguments['length']; i++) {
        if (typeof _arguments[i] === 'object') {
          _arguments[i] = inspect(_arguments[i], false, 4, false);
        }
      }

      const currentTime: Date = new Date();
      const message: string =
        '[' +
        currentTime.getUTCFullYear() +
        '/' +
        String(currentTime.getUTCMonth() + 1).padStart(2, '0') +
        '/' +
        String(currentTime.getUTCDate()).padStart(2, '0') +
        ' ' +
        String(currentTime.getUTCHours()).padStart(2, '0') +
        ':' +
        String(currentTime.getUTCMinutes()).padStart(2, '0') +
        ':' +
        String(currentTime.getUTCMinutes()).padStart(2, '0') +
        '][' +
        level.toUpperCase() +
        ']' +
        ' '.repeat(6 - level['length']) +
        _arguments.join(' ') +
        '\n';

      for (let i = 0; i < this['transports']['length']; i++) {
        this['transports'][i](message);
      }
    }

    return;
  }

  public info(..._arguments: unknown[]): void {
    this.log('info', _arguments);

    return;
  }

  public warn(..._arguments: unknown[]): void {
    this.log('warn', _arguments);

    return;
  }

  public error(..._arguments: unknown[]): void {
    this.log('error', _arguments);

    return;
  }

  public fatal(..._arguments: unknown[]): void {
    this.log('fatal', _arguments);

    return;
  }

  public trace(..._arguments: unknown[]): void {
    this.log('trace', _arguments);

    return;
  }

  public debug(..._arguments: unknown[]): void {
    this.log('debug', _arguments);

    return;
  }

  static getFileTransport(path: string): (message: string) => void {
    return function (message: string): void {
      appendFile(
        join(path, new Date().toISOString().slice(0, 10) + '.log'),
        message,
        'utf-8',
      ).catch(console.error);

      return;
    };
  }
}

export default new Logger({
  transports: [
    process['stdout'].write.bind(process['stdout']),
    Logger.getFileTransport(join(__dirname, '..', 'log')),
  ],
});
