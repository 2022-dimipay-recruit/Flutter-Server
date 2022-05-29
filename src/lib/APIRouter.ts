import KoaRouter from 'koa-router';

export default class APIRouter {
  protected router: KoaRouter;

  constructor() {
    this.router = new KoaRouter();
  }

  public routes(): KoaRouter.IMiddleware<any, {}> {
    return this.router.routes();
  }
}
