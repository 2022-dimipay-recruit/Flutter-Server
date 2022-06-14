import KoaRouter from 'koa-router';

// APIRouter
export default class {
  protected router: KoaRouter;

  constructor() {
    this['router'] = new KoaRouter();
  }

  public routes(): KoaRouter.IMiddleware<any, {}> {
    return this['router'].routes();
  }
}
