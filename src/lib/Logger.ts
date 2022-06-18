import {appendFile} from 'fs/promises';
import {DateTime} from 'luxon';
import path from 'path';
import {join} from 'path/posix';
import {inspect} from 'util';
import {LogLevel} from './Type';

/**
 * @class Logger
 *
 * Flutter-Server의 로거 라이브러리입니다. 모든 로깅은 해당 라이브러리를 통해 진행합니다.
 */
export default class Logger {
  public static global = new Logger('Logger', false);

  private _level = 0;
  private name = 'unknown';
  private path = path.join(__dirname, '..', '..', 'logs');
  private storeInFile = false;
  private levels: Record<LogLevel, number> = {
    fatal: 5,
    error: 4,
    warn: 3,
    info: 2,
    debug: 1,
    trace: 0,
  } as const;

  /**
   * 로거를 생성합니다.
   * @param options 로거의 옵션을 입력받습니다.
   */
  constructor(name: string, storeInFile = false) {
    this.name = name;
    this.storeInFile = storeInFile;
  }

  private log(level: LogLevel, _arguments: unknown[]): void {
    try {
      if (this.levels[level] >= this._level) {
        for (let i = 0; i < _arguments['length']; i++) {
          if (typeof _arguments[i] === 'object') {
            _arguments[i] = inspect(_arguments[i], false, 4, false);
          }
        }

        const currentTime = DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss');

        const message = `\<${currentTime}> [${this.name}:${level}]${' '.repeat(
          6 - level.length,
        )}${_arguments.join(' ')}\n`;

        process.stdout.write(message);

        //! Error : The "chunk" argument must be of type string or an instance of Buffer or Uint8Array.
        // if (typeof this.path === 'string' && this.storeInFile) {
        //   appendFile(
        //     join(this.path, new Date().toISOString().slice(0, 10) + '.log'),
        //     message,
        //     'utf-8',
        //   ).catch(process.stdout.write.bind(process.stdout));
        // }
      }
    } catch (error) {
      Logger.global.error(error);
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
}
