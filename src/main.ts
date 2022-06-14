import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import helmet from 'koa-helmet';
import logger from './lib/Logger';

import 'dotenv/config';
import ReturnRouter from './routes/ReturnRouter';
import {Context} from './lib/Type';
import AuthRouter from './routes/AuthRouter';
import UserRouter from './routes/UserRouter';

class MainServer {
  private app: Koa;
  private router: Router;

  constructor() {
    this['app'] = new Koa();
    this['router'] = new Router();

    this['app'].use(bodyParser());
    this['app'].use(cors());
    this['app'].use(helmet());
    this['app'].use(function (context: Context, next: () => void): void {
      function done(): void {
        context['res'].removeListener('close', done);

        logger.info(
          (context['ip'].charAt(0) !== ':' ? context['ips'][0] : '172.0.0.1') +
            ' "' +
            context['request']['method'] +
            ' ' +
            decodeURIComponent(context['request']['url']) +
            ' HTTP/' +
            context['req']['httpVersion'] +
            '" ' +
            context['status'] +
            ' "' +
            context['header']['user-agent'] +
            '"',
        );

        return;
      }

      context['res'].once('close', done);

      next();

      return;
    });

    this.createRoutes();

    this['app'].use(this['router'].routes());
    this['app'].use(this['router'].allowedMethods());
  }

  private createRoutes() {
    this['router'].use('/return', new ReturnRouter().routes());
    this['router'].use('/auth', new AuthRouter().routes());
    this['router'].use('/users', new UserRouter().routes());

    this['router'].get('/', function (context: Context): void {
      context['body'] = {
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
    this['app'].listen(port, function (): void {
      logger.info('Server listening on port ' + port);
    });
  }
}

const app = new MainServer();
app.start(Number(process.env.PORT) || 3000);
