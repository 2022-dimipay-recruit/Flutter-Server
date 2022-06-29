import {PrismaClient} from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      prismaClient: PrismaClient;
      userId?: string;
    }
  }
}
