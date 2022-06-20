import {appendFile} from 'fs/promises';
import {DateTime} from 'luxon';
import {join} from 'path';
import {inspect} from 'util';
import {LogLevel} from '../typings/CustomType';

/**
 * @class Logger
 *
 * Flutter-Server의 로거 라이브러리입니다 모든 로깅은 해당 라이브러리를 통해 진행합니다.
 */
export default class Logger {
  public static global = new Logger({
    name: 'Logger',
    storeInFile: true,
  });

  private level = 0;
  private name = 'unknown';
  private path = join(__dirname, '..', '..', 'logs');
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
  constructor(options: {name: string; level?: number; storeInFile?: boolean}) {
    if (typeof options !== 'undefined') {
      if (typeof options.name === 'string') {
        this.name = options.name;
      }

      if (typeof options.level === 'number') {
        this.level = options.level;
      }

      if (typeof options.storeInFile === 'boolean') {
        this.storeInFile = options.storeInFile;
      }
    }
  }

  private log(level: LogLevel, _arguments: unknown[]): void {
    try {
      if (this.levels[level] >= this.level) {
        for (let i = 0; i < _arguments.length; i++) {
          if (typeof _arguments[i] === 'object') {
            _arguments[i] = inspect(_arguments[i], false, 4, false);
          }
        }

        const message =
          '<' +
          DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss') +
          '> [' +
          this.name +
          ':' +
          level +
          '] ' +
          _arguments.join(' ') +
          '\n';

        process.stdout.write(message);

        if (this.storeInFile) {
          appendFile(
            join(this.path, new Date().toISOString().slice(0, 10) + '.log'),
            message,
            'utf-8',
          ).catch(process.stdout.write.bind(process.stdout));
        }
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
