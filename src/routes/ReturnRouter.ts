import APIRouter from '../lib/APIRouter.js';
import Logger from '../lib/Logger.js';
import {Context} from '../lib/Type.js';

// ReturnRouter
export default class ReturnRouter extends APIRouter {
  private logger: Logger;

  constructor() {
    super();

    this.logger = new Logger('ReturnRouter', true);

    this.router.get('/', (context: Context): void => {
      context.body = {
        status: 'success',
        data: [context.query],
      };

      this.logger.info(context.request.query);

      return;
    });
    this.router.post('/', (context: Context): void => {
      context.body = {
        status: 'success',
        data: [context.request.body],
      };

      this.logger.info(context.request.query);

      return;
    });
  }
}
