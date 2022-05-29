import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import helmet from 'koa-helmet';
import logger from 'koa-logger';

import 'dotenv/config';
import ReturnRouter from './routes/ReturnRouter';

class MainServer {
  private app: Koa;
  private router: Router;

  constructor() {
    this.app = new Koa();
    this.router = new Router();

    this.app.use(bodyParser());
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(logger());

    this.createRoutes();

    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());
  }

  private createRoutes() {
    this.router.use('/return', new ReturnRouter().routes());

    this.router.get('/', async ctx => {
      ctx.body = 'Hello World!';
    });
  }

  public start(port: number) {
    this.app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  }
}

const app = new MainServer();
app.start(3000);
