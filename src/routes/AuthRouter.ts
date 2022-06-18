import APIRouter from '../lib/APIRouter.js';
import {Context} from '../lib/Type.js';

// ReturnRouter
export default class AuthRouter extends APIRouter {
  constructor() {
    super();

    this.router.post('/login', (context: Context): void => {
      context.body = {
        status: 'success',
        data: null,
      };

      return;
    });

    this.router.post('/token', (context: Context): void => {
      context.body = {
        status: 'success',
        data: null,
      };

      return;
    });
  }
}
