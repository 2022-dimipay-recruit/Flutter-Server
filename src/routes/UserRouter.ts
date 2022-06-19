import APIRouter from '../lib/APIRouter';

// ReturnRouter
export default class UserRouter extends APIRouter {
  constructor() {
    super();

    this.router.post('/', (req, res): void => {
      res.send({
        status: 'success',
        data: null,
      });

      return;
    });

    this.router.get('/', (req, res): void => {
      res.send({
        status: 'success',
        data: null,
      });

      return;
    });

    this.router.post('/:id', (req, res): void => {
      res.send({
        status: 'success',
        data: null,
      });

      return;
    });

    this.router.patch('/:id', (req, res): void => {
      res.send({
        status: 'success',
        data: null,
      });

      return;
    });

    this.router.get('/:id', (req, res): void => {
      res.send({
        status: 'success',
        data: null,
      });

      return;
    });

    this.router.delete('/:id', (req, res): void => {
      res.send({
        status: 'success',
        data: null,
      });

      return;
    });
  }
}
