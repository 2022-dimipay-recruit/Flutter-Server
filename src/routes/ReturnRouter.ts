import APIRouter from '../lib/APIRouter';
import logger from '../lib/Logger';
import {Context} from '../lib/Type';

// ReturnRouter
export default class extends APIRouter {
  constructor() {
    super();

    this['router'].get('/', function (context: Context): void {
      context['body'] = {
        status: 'success',
        data: [context['query']],
      };

      logger.info(context['request']['query']);

      return;
    });
    this['router'].post('/', function (context: Context): void {
      context['body'] = {
        status: 'success',
        data: [context['request']['body']],
      };

      logger.info(context['request']['body']);

      return;
    });
  }
}
