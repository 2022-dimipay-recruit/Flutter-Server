import APIRouter from '../lib/APIRouter';
import {Context} from '../lib/Type';

// ReturnRouter
export default class extends APIRouter {
  constructor() {
    super();

    this['router'].post('/', function (context: Context): void {
      context['body'] = {
        status: 'success',
        data: null,
      };

      return;
    });

    this['router'].get('/', function (context: Context): void {
      context['body'] = {
        status: 'success',
        data: null,
      };

      return;
    });

    this['router'].post('/:id', function (context: Context): void {
      context['body'] = {
        status: 'success',
        data: null,
      };

      return;
    });

    this['router'].patch('/:id', function (context: Context): void {
      context['body'] = {
        status: 'success',
        data: null,
      };

      return;
    });

    this['router'].get('/:id', function (context: Context): void {
      context['body'] = {
        status: 'success',
        data: null,
      };

      return;
    });

    this['router'].delete('/:id', function (context: Context): void {
      context['body'] = {
        status: 'success',
        data: null,
      };

      return;
    });
  }
}
