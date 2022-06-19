import APIRouter from '../lib/APIRouter';
import Logger from '../lib/Logger';
import {Context} from '../lib/Type';

// ReturnRouter
export default class ReturnRouter extends APIRouter {
  private logger: Logger;

  constructor() {
    super();

    this.logger = new Logger({
      name: 'ReturnRouter',
      storeInFile: true,
    });

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
