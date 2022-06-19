import APIRouter from '../lib/APIRouter';

// ReturnRouter
export default class AuthRouter extends APIRouter {
  constructor() {
    super();

    this.router.post('/login', (req, res): void => {
      res.send({
        status: 'success',
        data: null,
      });

      return;
    });

    this.router.post('/token', (req, res): void => {
      res.send({
        status: 'success',
        data: null,
      });

      return;
    });
  }
}
