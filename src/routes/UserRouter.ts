import {User} from '@prisma/client';
import UserController from '../controllers/UserController';
import APIRouter from '../lib/APIRouter';
import getValidationMiddleware from '../middlewares/ValidationMiddleware';
import pageSchema from '../schemas/PageSchema';
import userSchema from '../schemas/UserSchema';
import {} from '../typings/ExpressRequest';

// ReturnRouter
export default class UserRouter extends APIRouter {
  constructor() {
    super();

    this.router.post(
      '/',
      getValidationMiddleware({
        body: userSchema.getObjectSchema({
          requiredProperties: [
            'link',
            'nickname',
            'email',
            'profileImage',
            'description',
          ],
          optionalProperties: ['googleUid', 'kakaoUid'],
        }),
      }),
      (req, res): void => {
        if (
          typeof req.body.googleUid === 'string' ||
          typeof req.body.kakaoUid === 'string'
        ) {
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
        } else {
          res.send({
            status: 'fail',
            data: {
              message: 'Invalid social information',
            },
          });
        }

        return;
      },
    );

    this.router.get(
      '/',
      getValidationMiddleware({
        query: pageSchema,
      }),
      (req, res): void => {
        UserController.read(req.prismaClient.user, {
          page: {
            index:
              Number.parseInt(
                (req.query.page as Record<string, string>)?.index,
                10,
              ) || 0,
            size:
              Number.parseInt(
                (req.query.page as Record<string, string>)?.size,
                10,
              ) || 100,
            order:
              ((req.query.page as Record<string, string>)?.order as
                | 'asc'
                | 'desc') || 'asc',
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
      },
    );

    this.router.patch(
      '/id/:id',
      getValidationMiddleware({
        params: userSchema.getObjectSchema({requiredProperties: ['id']}),
        body: userSchema.getObjectSchema({
          optionalProperties: [
            'description',
            'email',
            'link',
            'nickname',
            'profileImage',
          ],
        }),
      }),
      (req, res): void => {
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
      },
    );

    this.router.get(
      '/id/:id',
      getValidationMiddleware({
        params: userSchema.getObjectSchema({requiredProperties: ['id']}),
      }),
      (req, res): void => {
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
      },
    );

    this.router.delete(
      '/id/:id',
      getValidationMiddleware({
        params: userSchema.getObjectSchema({requiredProperties: ['id']}),
      }),
      (req, res): void => {
        res.status(501);
        res.send({
          status: 'success',
          data: null,
        });

        return;
      },
    );

    this.router.patch(
      '/link/:link',
      getValidationMiddleware({
        params: userSchema.getObjectSchema({requiredProperties: ['link']}),
        body: userSchema.getObjectSchema({
          optionalProperties: [
            'description',
            'email',
            'link',
            'nickname',
            'profileImage',
          ],
        }),
      }),
      (req, res): void => {
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
      },
    );

    this.router.get(
      '/link/:link',
      getValidationMiddleware({
        params: userSchema.getObjectSchema({requiredProperties: ['link']}),
      }),
      (req, res): void => {
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
      },
    );

    this.router.delete(
      '/link/:link',
      getValidationMiddleware({
        params: userSchema.getObjectSchema({requiredProperties: ['link']}),
      }),
      (req, res): void => {
        res.status(501);
        res.send({
          status: 'success',
          data: null,
        });

        return;
      },
    );
  }
}
