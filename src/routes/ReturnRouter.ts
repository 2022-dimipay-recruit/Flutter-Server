import APIRouter from '../lib/APIRouter';
import Logger from '../lib/Logger';

// ReturnRouter
export default class ReturnRouter extends APIRouter {
  private logger: Logger;

  constructor() {
    super();

    this.logger = new Logger({
      name: 'ReturnRouter',
      storeInFile: true,
    });

    this.router.get('/', (req, res): void => {
      this.logger.info(req.query);
      res.send({
        status: 'success',
        data: [req.query],
      });

      return;
    });
    this.router.post('/', (req, res): void => {
      this.logger.info(req.body);
      res.send({
        status: 'success',
        data: [req.body],
      });

      return;
    });
  }
}
