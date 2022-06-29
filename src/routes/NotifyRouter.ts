import NotifyController from '../controllers/NotifyController';
import APIRouter from '../lib/APIRouter';
import getAuthenticationMiddleware from '../middlewares/AuthenticationMiddleware';
import getValidationMiddleware from '../middlewares/ValidationMiddleware';
import NotifySchema from '../schemas/NotifySchema';

export default class FollowRouter extends APIRouter {
  constructor() {
    super();

    this.router.get('/', getAuthenticationMiddleware(), (req, res) => {
      NotifyController.getNotifyList(req.prismaClient, req.userId as string)
        .then(notifies => {
          res.send({
            status: 'success',
            data: notifies,
          });
        })
        .catch(error => {
          res.status(400);
          res.send({
            status: 'fail',
            data: {
              message: error.message,
            },
          });
        });
    });

    this.router.patch(
      '/:id',
      getAuthenticationMiddleware(),
      getValidationMiddleware({
        params: NotifySchema.getObjectSchema({
          requiredProperties: ['id'],
        }),
      }),
      (req, res) => {
        NotifyController.readNotify(req.prismaClient, req.params.id)
          .then(notify => {
            res.send({
              status: 'success',
              data: notify,
            });
          })
          .catch(error => {
            res.status(400);
            res.send({
              status: 'fail',
              data: {
                message: error.message,
              },
            });
          });
      },
    );

    this.router.delete(
      '/:id',
      getAuthenticationMiddleware(),
      getValidationMiddleware({
        params: NotifySchema.getObjectSchema({
          requiredProperties: ['id'],
        }),
      }),
      (req, res) => {
        NotifyController.deleteNotify(req.prismaClient, req.params.id)
          .then(() => {
            res.send({
              status: 'success',
              data: null,
            });
          })
          .catch(error => {
            res.status(400);
            res.send({
              status: 'fail',
              data: {
                message: error.message,
              },
            });
          });
      },
    );
  }
}
