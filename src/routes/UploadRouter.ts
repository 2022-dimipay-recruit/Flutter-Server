import APIRouter from '../lib/APIRouter';
import Logger from '../lib/Logger';
import upload from '../lib/Uploader';
import getAuthenticationMiddleware from '../middlewares/AuthenticationMiddleware';

// ReturnRouter
export default class UploadRouter extends APIRouter {
  private logger: Logger;

  constructor() {
    super();

    this.logger = new Logger({
      name: 'UploadRouter',
      storeInFile: true,
    });

    this.router.post(
      '/image/single',
      getAuthenticationMiddleware(),
      upload.single('img'),
      (req, res): void => {
        this.logger.info(req.body);
        res.send({
          status: 'success',
          data: [req.file],
        });

        return;
      },
    );
  }
}
