import Express from 'express';
import Logger from '../lib/Logger';

const logger = new Logger({
  name: 'MainServer',
  storeInFile: true,
});

export default function LogMiddleware() {
  return (
    req: Express.Request,
    res: Express.Response,
    next: () => void,
  ): void => {
    if (res.headersSent) {
      logger.info(
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
        logger.info(
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
  };
}
