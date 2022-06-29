// import KoaRouter from 'koa-router';
import Express from 'express';

/**
 * @class APIRouter
 *
 * Flutter-Server의 모든 Router는 해당 클래스를 상속받아야 합니다.
 */
export default class APIRouter {
  protected router: Express.Router;

  /**
   * @constructor
   */
  constructor() {
    this.router = Express.Router();
  }

  /**
   * @returns 라우팅 등록을 위한 미들웨어를 반환합니다.
   */
  get expressRouter(): Express.Router {
    return this.router;
  }
}
