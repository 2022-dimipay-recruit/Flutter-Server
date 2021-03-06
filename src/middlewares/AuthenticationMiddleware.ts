import {NextFunction, Request, Response} from 'express';
import jsonWebToken, {Jwt} from 'jsonwebtoken';

export function getAuthenticationMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization?.startsWith('Bearer ')) {
      try {
        const jwt: Jwt = jsonWebToken.verify(
          req.headers.authorization.slice(7),
          process.env.JWT_SECRET,
          {complete: true},
        );

        if (
          typeof jwt.payload === 'object' &&
          jwt.payload.typ === 'a' &&
          typeof jwt.payload.uid === 'string'
        ) {
          req.userId = jwt.payload.uid;

          next();
        } else {
          throw '';
        }
      } catch {
        res.status(401);
        res.send({
          status: 'fail',
          data: {
            message: 'Invalid authorization token',
          },
        });
      }
    } else {
      res.status(401);
      res.send({
        status: 'fail',
        data: {
          message: 'Unauthorized token',
        },
      });
    }
  };
}

export default getAuthenticationMiddleware;
