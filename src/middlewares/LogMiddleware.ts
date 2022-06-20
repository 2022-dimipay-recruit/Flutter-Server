import Express from 'express';
import Logger from '../lib/Logger';

export default class LogMiddleware {
  private logger: Logger;

  constructor() {
    this.logger = new Logger({
      name: 'MainServer',
      storeInFile: true,
    });
  }

  public use(
    req: Express.Request,
    res: Express.Response,
    next: () => void,
  ): void {
    if (res.headersSent) {
      this.logger.info(
        (req.ip.charAt(0) !== ':' ? req.ips[0] : '172.0.0.1') +
          ' "' +
          req.method +
          ' ' +
          decodeURIComponent(req.url) +
          ' HTTP/' +
          req.httpVersion +
          '" ' +
          res.statusCode +
          ' "' +
          res.header('user-agent') +
          '"',
      );
    } else {
      res.on('finish', () => {
        this.logger.info(
          (req.ip.charAt(0) !== ':' ? req.ips[0] : '172.0.0.1') +
            ' "' +
            req.method +
            ' ' +
            decodeURIComponent(req.url) +
            ' HTTP/' +
            req.httpVersion +
            '" ' +
            res.statusCode +
            ' "' +
            req.header('user-agent') +
            '"',
        );
      });
    }
    next();
  }
}
