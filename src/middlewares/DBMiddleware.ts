import Express from 'express';
import {PrismaClient} from '@prisma/client';

const prismaClient = new PrismaClient();

export default function DBMiddleware() {
  return (
    req: Express.Request,
    res: Express.Response,
    next: () => void,
  ): void => {
    req.prismaClient = prismaClient;
    next();
  };
}
