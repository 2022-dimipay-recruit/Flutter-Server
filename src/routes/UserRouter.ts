import {User} from '@prisma/client';
import UserController from '../controllers/UserController';
import APIRouter from '../lib/APIRouter';
import {} from '../typings/ExpressRequest';

// ReturnRouter
export default class UserRouter extends APIRouter {
  constructor() {
    super();

    this.router.post('/', (req, res): void => {
      UserController.create(req.prismaClient.user, req.body)
        .then((userId: User['id']) => {
          res.send({
            status: 'success',
            data: {
              userId: userId,
            },
          });

          return;
        })
        .catch((error: any) => {
          res.status(400);
          res.send({
            status: 'fail',
            data: {
              message: error.message,
            },
          });
        });

      return;
    });

    this.router.get('/', (req, res): void => {
      UserController.read(req.prismaClient.user, {
        page: {
          index:
            Number.parseInt(
              (req.query.page as Record<string, string>).index,
              10,
            ) || 0,
          size:
            Number.parseInt(
              (req.query.page as Record<string, string>).size,
              10,
            ) || 100,
          order: (req.query.page as Record<string, string>).order as
            | 'asc'
            | 'desc',
        },
      })
        .then((user: User | User[]) => {
          res.send({
            status: 'success',
            data: user,
          });

          return;
        })
        .catch((error: any) => {
          res.status(400);
          res.send({
            status: 'fail',
            data: {
              message: error.message,
            },
          });
        });

      return;
    });

    this.router.patch('/id/:id', (req, res): void => {
      UserController.update(req.prismaClient.user, req.params, req.body)
        .then((user: Partial<User>) => {
          res.send({
            status: 'success',
            data: [user],
          });

          return;
        })
        .catch((error: any) => {
          res.status(400);
          res.send({
            status: 'fail',
            data: {
              message: error.message,
            },
          });
        });

      return;
    });

    this.router.get('/id/:id', (req, res): void => {
      UserController.read(req.prismaClient.user, {user: req.params})
        .then((user: User | User[]) => {
          res.send({
            status: 'success',
            data: [user],
          });

          return;
        })
        .catch((error: any) => {
          res.status(400);
          res.send({
            status: 'fail',
            data: {
              message: error.message,
            },
          });
        });

      return;
    });

    this.router.delete('/id/:id', (req, res): void => {
      res.status(501);
      res.send({
        status: 'success',
        data: null,
      });

      return;
    });

    this.router.patch('/link/:link', (req, res): void => {
      UserController.update(req.prismaClient.user, req.params, req.body)
        .then((user: Partial<User>) => {
          res.send({
            status: 'success',
            data: [user],
          });

          return;
        })
        .catch((error: any) => {
          res.status(400);
          res.send({
            status: 'fail',
            data: {
              message: error.message,
            },
          });
        });

      return;
    });

    this.router.get('/link/:link', (req, res): void => {
      UserController.read(req.prismaClient.user, {user: req.params})
        .then((user: User | User[]) => {
          res.send({
            status: 'success',
            data: [user],
          });

          return;
        })
        .catch((error: any) => {
          res.status(400);
          res.send({
            status: 'fail',
            data: {
              message: error.message,
            },
          });
        });

      return;
    });

    this.router.delete('/link/:link', (req, res): void => {
      res.status(501);
      res.send({
        status: 'success',
        data: null,
      });

      return;
    });
  }
}
