import KoaRouter from 'koa-router';

/**
 * @class APIRouter
 *
 * Flutter-Server의 모든 Router는 해당 클래스를 상속받아야 합니다.
 */
export default class APIRouter {
  protected router: KoaRouter;

  /**
   * @constructor
   */
  constructor() {
    this.router = new KoaRouter();
  }

  /**
   * @returns 라우팅 등록을 위한 미들웨어를 반환합니다.
   */
  public routes(): KoaRouter.IMiddleware<any, {}> {
    return this.router.routes();
  }
}
