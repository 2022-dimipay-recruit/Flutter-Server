import {User} from '@prisma/client';
import UserController from '../controllers/UserController';
import APIRouter from '../lib/APIRouter';
import getValidationMiddleware from '../middlewares/ValidationMiddleware';
import userSchema from '../schemas/UserSchema';
import jsonWebToken from 'jsonwebtoken';
import storage from '../lib/Storage';
import getAuthenticationMiddleware from '../middlewares/AuthenticationMiddleware';

// ReturnRouter
export default class AuthRouter extends APIRouter {
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

              // TODO: replace it if you can
              storage.add(refreshToken.split('.').pop());

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
                },
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
      getAuthenticationMiddleware(),
      (req, res): void => {
        // @ts-expect-error asdas
        if (storage.has(req.headers.authorization.split('.').pop())) {
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

        return;
      },
    );

    this.router.post('/logout', getAuthenticationMiddleware(), (req, res) => {
      storage.delete(req.headers.authorization?.split('.').pop());

      res.send({
        status: 'success',
        data: null,
      });
    });
  }
}
