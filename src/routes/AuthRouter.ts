import {User} from '@prisma/client';
import UserController from '../controllers/UserController';
import APIRouter from '../lib/APIRouter';
import getValidationMiddleware from '../middlewares/ValidationMiddleware';
import userSchema from '../schemas/UserSchema';
import jsonWebToken from 'jsonwebtoken';
import storage from '../lib/Storage';
import getAuthenticationMiddleware from '../middlewares/AuthenticationMiddleware';
import schema from 'fluent-json-schema';

// AuthRouter
export default class extends APIRouter {
  constructor() {
    super();

    this.router.post(
      '/login',
      getValidationMiddleware({
        body: userSchema.getObjectSchema({
          optionalProperties: ['googleUid', 'kakaoUid'],
        }),
      }),
      (req, res): void => {
        if (
          typeof req.body.googleUid === 'string' ||
          typeof req.body.kakaoUid === 'string'
        ) {
          UserController.read(req.prismaClient.user, {user: req.body})
            // @ts-expect-error asdf
            .then((user: User) => {
              const refreshToken: string = jsonWebToken.sign(
                {
                  uid: user.id,
                  typ: 'r',
                },
                process.env.JWT_SECRET,
              );

              storage
                .add(refreshToken.split('.').pop())
                .then(() => {
                  res.send({
                    status: 'success',
                    data: {
                      type: 'Bearer',
                      refreshToken: refreshToken,
                      accessToken: jsonWebToken.sign(
                        {
                          uid: user.id,
                          typ: 'a',
                        },
                        process.env.JWT_SECRET,
                        {
                          expiresIn: '7d',
                        },
                      ),
                      userId: user.id,
                    },
                  });
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
            })
            .catch(() => {
              res.status(400);

              res.send({
                status: 'fail',
                data: {
                  message: 'Invalid user information',
                },
              });

              return;
            });
        } else {
          res.status(400);

          res.send({
            status: 'fail',
            data: {
              message: 'Lack of user information',
            },
          });
        }

        return;
      },
    );

    this.router.post(
      '/token',
      getValidationMiddleware({
        body: schema
          .object()
          .prop(
            'refreshToken',
            schema.string().pattern(/^(?:[\w-]*\.){2}[\w-]*$/),
          ),
      }),
      (req, res): void => {
        storage
          .has(req.body.refreshToken?.split('.').pop())
          .then((isJWTStored: boolean) => {
            if (isJWTStored) {
              res.send({
                status: 'success',
                data: {
                  type: 'Bearer',
                  accessToken: jsonWebToken.sign(
                    {
                      uid: req.userId,
                      typ: 'a',
                    },
                    process.env.JWT_SECRET,
                    {
                      expiresIn: '7d',
                    },
                  ),
                  userId: req.userId,
                },
              });
            } else {
              res.status(401);
              res.send({
                status: 'fail',
                data: {
                  message: 'Invalid authorization token',
                },
              });
            }
          })
          .catch(() => {
            res.status(401);
            res.send({
              status: 'fail',
              data: {
                message: 'Invalid authorization token',
              },
            });

            return;
          });

        return;
      },
    );

    this.router.post('/logout', getAuthenticationMiddleware(), (req, res) => {
      storage
        .delete(req.headers.authorization?.split('.').pop())
        .then(() => {
          res.send({
            status: 'success',
            data: null,
          });
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
    });
  }
}
