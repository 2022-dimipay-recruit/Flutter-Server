import APIRouter from '../lib/APIRouter';
import {Context} from '../lib/Type';

// ReturnRouter
export default class extends APIRouter {
  constructor() {
    super();

    this['router'].post('/login', function (context: Context): void {
      context['body'] = {
        status: 'success',
        data: null,
      };

      return;
    });

    this['router'].post('/token', function (context: Context): void {
      context['body'] = {
        status: 'success',
        data: null,
      };

      return;
    });
  }
}
