// import Koa from 'koa';
// import Router from 'koa-router';
// import bodyParser from 'koa-bodyparser';
// import cors from '@koa/cors';
// import helmet from 'koa-helmet';

import Express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import './lib/Environment';

import ReturnRouter from './routes/ReturnRouter';
import AuthRouter from './routes/AuthRouter';
import UserRouter from './routes/UserRouter';
import LoginRouter from './routes/LoginRouter';
import Logger from './lib/Logger';

class MainServer {
  private app: Express.Application;
  private router: Express.Router;
  private logger: Logger;

  constructor() {
    this.app = Express();
    this.router = Express.Router();

    this.logger = new Logger({
      name: 'MainServer',
      storeInFile: true,
    });

    this.app.use(Express.json());
    this.app.use(Express.urlencoded({extended: true}));
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use((req, res, next: () => void): void => {
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
    });

    this.createRoutes();

    this.app.use(this.router);

    // this.app.use(this.router.routes());
    // this.app.use(this.router.allowedMethods());
  }

  private createRoutes() {
    this.router.use('/return', new ReturnRouter().expressRouter);
    this.router.use('/auth', new AuthRouter().expressRouter);
    this.router.use('/users', new UserRouter().expressRouter);
    this.router.use('/login', new LoginRouter().expressRouter);

    this.router.get('/', (req, res): void => {
      res.send({
        status: 'success',
        data: [
          {
            body: 'Hello World!',
          },
        ],
      });
    });
  }

  public start(port: number) {
    this.app.listen(port, (): void => {
      this.logger.info('Server listening on port ' + port);
    });
  }
}

const app = new MainServer();
app.start(Number(process.env.PORT) || 3000);
