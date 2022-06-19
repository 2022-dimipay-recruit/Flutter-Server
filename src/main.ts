import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import helmet from 'koa-helmet';

import './lib/Environment';

import ReturnRouter from './routes/ReturnRouter';
import {Context} from './lib/Type';
import AuthRouter from './routes/AuthRouter';
import UserRouter from './routes/UserRouter';
import LoginRouter from './routes/LoginRouter';
import Logger from './lib/Logger';

class MainServer {
  private app: Koa;
  private router: Router;
  private logger: Logger;

  constructor() {
    this.app = new Koa();
    this.router = new Router();

    this.logger = new Logger({
      name: 'MainServer',
      storeInFile: true,
    });

    this.app.use(bodyParser());
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use((context: Context, next: () => void): void => {
      const done = (): void => {
        context.res.removeListener('close', done);

        this.logger.info(
          (context.ip.charAt(0) !== ':' ? context.ips[0] : '172.0.0.1') +
            ' "' +
            context.request.method +
            ' ' +
            decodeURIComponent(context.request.url) +
            ' HTTP/' +
            context.req.httpVersion +
            '" ' +
            context.status +
            ' "' +
            context.header['user-agent'] +
            '"',
        );

        return;
      };

      context.res.once('close', done);

      next();

      return;
    });

    this.createRoutes();

    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());
  }

  private createRoutes() {
    this.router.use('/return', new ReturnRouter().routes());
    this.router.use('/auth', new AuthRouter().routes());
    this.router.use('/users', new UserRouter().routes());
    this.router.use('/login', new LoginRouter().routes());

    this.router.get('/', (context: Context): void => {
      context.body = {
        status: 'success',
        data: [
          {
            body: 'Hello World!',
          },
        ],
      };

      return;
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
