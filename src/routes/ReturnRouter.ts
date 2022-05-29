import APIRouter from '../lib/APIRouter';

export default class ReturnRouter extends APIRouter {
  constructor() {
    super();

    this.router.get('/', async ctx => {
      ctx.body = ctx.query;
    });
    this.router.post('/', async ctx => {
      ctx.body = ctx.request.body;
    });
  }
}
