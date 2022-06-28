import {Follows, User} from '@prisma/client';
import FollowController from '../controllers/FollowController';
import UserController from '../controllers/UserController';
import APIRouter from '../lib/APIRouter';
import getAuthenticationMiddleware from '../middlewares/AuthenticationMiddleware';
import getValidationMiddleware from '../middlewares/ValidationMiddleware';
import pageSchema from '../schemas/PageSchema';
import userSchema from '../schemas/UserSchema';

// FollowRouter
export default class extends APIRouter {
  constructor() {
    super();

    this.router.post(
      '/:id/follow',
      getAuthenticationMiddleware(),
      getValidationMiddleware({
        params: userSchema.getObjectSchema({
          requiredProperties: ['id'],
        }),
      }),
      (req, res) => {
        UserController.read(req.prismaClient.user, {user: {id: req.params.id}})
          .then(() => {
            FollowController.createFollow(
              req.prismaClient,
              req.userId as string,
              req.params.id,
            )
              .then((follows: Follows & {follower: User; following: User}) => {
                res.send({
                  status: 'success',
                  data: follows,
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

                return;
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

            return;
          });

        return;
      },
    );

    this.router.delete(
      '/:id',
      getAuthenticationMiddleware(),
      getValidationMiddleware({
        params: userSchema.getObjectSchema({
          requiredProperties: ['id'],
        }),
      }),
      (req, res) => {
        UserController.read(req.prismaClient.user, {user: {id: req.params.id}})
          .then(() => {
            FollowController.deleteFollow(
              req.prismaClient,
              req.userId as string,
              req.params.id,
            )
              .then(() => {
                res.send({
                  status: 'success',
                  data: null,
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

                return;
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

            return;
          });

        return;
      },
    );

    this.router.get(
      '/:id/follower',
      getAuthenticationMiddleware(),
      getValidationMiddleware({
        params: userSchema.getObjectSchema({
          requiredProperties: ['id'],
        }),
        query: pageSchema,
      }),
      (req, res) => {
        UserController.read(req.prismaClient.user, {user: {id: req.params.id}})
          .then(() => {
            FollowController.readFollower(req.prismaClient, req.params.id, {
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
            })
              .then(
                (
                  followers: (Follows & {follower: User; following: User})[],
                ) => {
                  res.send({
                    status: 'success',
                    data: followers,
                  });

                  return;
                },
              )
              .catch((error: any) => {
                res.status(400);
                res.send({
                  status: 'fail',
                  data: {
                    message: error.message,
                  },
                });

                return;
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

            return;
          });

        return;
      },
    );

    this.router.get(
      '/:id/following',
      getAuthenticationMiddleware(),
      getValidationMiddleware({
        params: userSchema.getObjectSchema({
          requiredProperties: ['id'],
        }),
        query: pageSchema,
      }),
      (req, res) => {
        UserController.read(req.prismaClient.user, {user: {id: req.params.id}})
          .then(() => {
            FollowController.readFollowed(req.prismaClient, req.params.id, {
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
            })
              .then(
                (
                  followers: (Follows & {follower: User; following: User})[],
                ) => {
                  res.send({
                    status: 'success',
                    data: followers,
                  });

                  return;
                },
              )
              .catch((error: any) => {
                res.status(400);
                res.send({
                  status: 'fail',
                  data: {
                    message: error.message,
                  },
                });

                return;
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

            return;
          });
      },
    );
  }
}
