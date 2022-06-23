import Express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';

import './lib/Environment';

import ReturnRouter from './routes/ReturnRouter';
import AuthRouter from './routes/AuthRouter';
import UserRouter from './routes/UserRouter';
import LoginRouter from './routes/LoginRouter';
import Logger from './lib/Logger';
import LogMiddleware from './middlewares/LogMiddleware';
import DBMiddleware from './middlewares/DBMiddleware';
import FollowRouter from './routes/FollowRouter';
import UploadRouter from './routes/UploadRouter';
import AnswerRouter from './routes/AnswerRouter';

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
    this.app.use(
      '/images',
      Express.static(path.join(__dirname, '..', 'uploads')),
    );
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(LogMiddleware());
    this.app.use(DBMiddleware());

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
    this.router.use('/follow', new FollowRouter().expressRouter);
    this.router.use('/uploads', new UploadRouter().expressRouter);
    this.router.use('/answer', new AnswerRouter().expressRouter);

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
