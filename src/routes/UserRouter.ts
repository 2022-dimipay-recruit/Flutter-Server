import APIRouter from '../lib/APIRouter.js';
import {Context} from '../lib/Type.js';

// ReturnRouter
export default class UserRouter extends APIRouter {
  constructor() {
    super();

    this.router.post('/', (context: Context): void => {
      context.body = {
        status: 'success',
        data: null,
      };

      return;
    });

    this.router.get('/', (context: Context): void => {
      context.body = {
        status: 'success',
        data: null,
      };

      return;
    });

    this.router.post('/:id', (context: Context): void => {
      context.body = {
        status: 'success',
        data: null,
      };

      return;
    });

    this.router.patch('/:id', (context: Context): void => {
      context.body = {
        status: 'success',
        data: null,
      };

      return;
    });

    this.router.get('/:id', (context: Context): void => {
      context.body = {
        status: 'success',
        data: null,
      };

      return;
    });

    this.router.delete('/:id', (context: Context): void => {
      context.body = {
        status: 'success',
        data: null,
      };

      return;
    });
  }
}
